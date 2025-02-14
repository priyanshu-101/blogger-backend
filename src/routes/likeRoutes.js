const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Post = require("../models/Post");
const authenticateToken = require('../middleware/auth');

router.post("/like/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.userId;

    console.log(userId);

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingLike = await Like.findOne({ user: userId, post: postId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      return res.json({ message: "Unliked" });
    } else {
      await Like.create({ user: userId, post: postId });
      return res.json({ message: "Liked" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
