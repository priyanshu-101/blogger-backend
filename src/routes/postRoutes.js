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

module.exports = router;