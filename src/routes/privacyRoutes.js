const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Request = require('../models/Request');
const authenticateToken = require('../middleware/auth');
const mongoose = require('mongoose');

router.patch("/:postId/privacy", authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
      const { privacy } = req.body;
  
      if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({ error: "Invalid postId" });
      }
      if (!["friends-only", "public"].includes(privacy)) {
        return res.status(400).json({ error: "Invalid privacy setting" });
      }
      const post = await Post.findOne({ 
        author: req.user.id  
      });
      if (!post) {
        return res.status(404).json({ error: "Post not found or unauthorized" });
      }
      post.privacy = privacy;
      await post.save();
  
      res.status(200).json({ message: "Post privacy updated", post });
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });

  router.get("/:postId/access", authenticateToken, async (req, res) => {
    try {
      const { postId } = req.params;
      const  userId  = req.user?.id;
      console.log(userId);
  
      // Validate input
      if (!userId) {
        return res.status(400).json({ error: "UserId is required" });
      }
  
      // Find the post
      const post = await Post.findById(postId);
      console.log(post);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // If post is public, grant access
      if (post.privacy === "public") {
        return res.status(200).json({ access: true, message: "hi" }).send({message: "Post is public"});
      }
  
      // Check if the requester is a friend of the post owner
      const friendship = await Request.findOne({
        $or: [
          { user1: post.author, user2: userId, status: "accepted" },
          { user1: userId, user2: post.author, status: "accepted" },
        ],
      });
  
      console.log(friendship);
      if (friendship) {
        return res.status(200).json({ access: true, message: "dhcvhjd" }).send({message: "Only friends can access this post"});
      } else {
        return res.status(403).json({ access: false, message: "Only friends can access this post" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error", details: error.message });
    }
  });
module.exports = router;