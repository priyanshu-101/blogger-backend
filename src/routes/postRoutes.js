const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

router.post('/posts', async (req, res) => {
    try {
      const { title, content, author, tags } = req.body;
  
      if (!title || !content || !author) {
        return res.status(400).json({ 
          error: 'Title, content, and author are required' 
        });
      }
      const newPost = new Post({
        title,
        content,
        author,
        tags: tags || []
      });
      const savedPost = await newPost.save();
      res.status(201).json({
        message: 'Post created successfully',
        post: savedPost
      });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ 
        error: 'Failed to create post',
        details: error.message 
      });
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
module.exports = router;