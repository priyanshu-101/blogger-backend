const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

router.post('/posts', authenticateToken, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        if (!title || !content) {
            return res.status(400).send({ message: 'Title and content are required' });
        }
        const post = new Post({
            title,
            content,
            author: req.user.id, 
            tags,
        }); 
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

router.get('/posts', authenticateToken, async (req, res) => {
    try {
        const {
            page = 2,
            limit = 10,
            author,
            tag,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;
        const filter = {};
        if (author) filter.author = author;
        if (tag) filter.tags = tag;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const posts = await Post.find(filter)
            .sort(sortOptions)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalPosts = await Post.countDocuments(filter);

        res.json({
            posts,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            totalPosts
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            error: 'Failed to fetch posts',
            details: error.message
        });
    }
});

router.get('/post/:id', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.id });
        if (posts.length === 0) {
            return res.status(404).send({ message: 'No posts found for this user' });
        }
        res.status(200).send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

router.delete('/postdelete/:id', authenticateToken, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user.id });
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }
        res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

router.put('/postupdate/:id', authenticateToken, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        if (!title && !content) {
            return res.status(400).send({ message: 'No fields provided for update' });
        }
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, author: req.user.id }, 
            { $set: { title, content,tags } },
            { new: true }
        );

        if (!post) {
            return res.status(404).send({ message: 'Post not found or not authorized' });
        }

        res.status(200).send({ message: 'Post updated successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

router.get('/recommended/:id', authenticateToken, async (req, res) => {
    try {
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                message: 'Invalid user ID format' 
            });
        }
        const userPosts = await Post.find({ 
            author: req.params.id,
        })
        .select('tags title'); 
        const userTags = userPosts.reduce((tags, post) => {
            const postTags = Array.isArray(post.tags) ? post.tags : 
                           typeof post.tags === 'string' ? post.tags.split(',').map(tag => tag.trim()) :
                           [];
            return [...new Set([...tags, ...postTags])];
        }, []);

        if (userTags.length === 0) {
            return res.status(404).json({
                message: 'No tags found from user posts to base recommendations on',
                debug: {
                    postsFound: userPosts.length,
                    rawTags: userPosts.map(post => post.tags)
                }
            });
        }
        const recommendations = await Post.find({
            author: { $ne: req.params.id },
            tags: { $in: userTags }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('author', 'username avatar')
        .select('title content tags createdAt');

        if (!recommendations.length) {
            return res.status(404).json({
                message: 'No matching posts found',
                debug: {
                    searchedTags: userTags,
                    postsChecked: await Post.countDocuments({ 
                        author: { $ne: req.params.id }, 
                    })
                }
            });
        }

        return res.status(200).json({
            success: true,
            count: recommendations.length,
            debug: {
                userTagsFound: userTags,
                totalUserPosts: userPosts.length
            },
            data: recommendations
        });

    } catch (error) {
        console.error('Error in recommended posts:', error?.message, error?.stack);
        return res.status(500).json({
            message: 'Failed to fetch recommended posts',
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

module.exports = router;

