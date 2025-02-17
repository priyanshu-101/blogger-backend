const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    tags: {
        type: [String],
    },
    image: {
        type: String,
        default: null,
    },
    privacy: {
        type: String,
        enum: ["friends-only", "public"],
        default: 'public',
    },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);