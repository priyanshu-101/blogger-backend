const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authenticateToken = require('../middleware/auth');

router.post('/comments', authenticateToken, async (req, res) => {
    try {
        const { postId, content } = req.body;
        if (!postId || !content) {
            return res.status(400).json({ 
                message: 'Missing required fields: postId, content'
            });
        }
        const newComment = new Comment({
            postId,
            userId: req.user.id, 
            content
        });
        const savedComment = await newComment.save();
        res.status(201).json({
            message: 'Comment created successfully',
            comment: savedComment
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ 
            message: 'Failed to create comment', 
            error: error.message 
        });
    }
});

router.get('/comments/:postId', authenticateToken, async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId });
        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ 
            message: 'Failed to fetch comments', 
            error: error.message 
        });
    }
});

router.delete('/commentdelete/:id', authenticateToken, async (req, res) => {
    try {
        const comment = await Comment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ 
            message: 'Failed to delete comment', 
            error: error.message 
        });
    }
});
router.put('/commentupdate/:id', authenticateToken, async (req, res) => {
    try {
        const {postId, content } = req.body;
        if (!content) {
            return res.status(400).json({ message: 'No content provided for update' });
        }
        const comment = await Comment.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id }, 
            { $set: { content } },
            { new: true }
        );
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or not authorized' });
        }
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ 
            message: 'Failed to update comment', 
            error: error.message 
        });
    }
});
module.exports = router;