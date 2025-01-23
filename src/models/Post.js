const moongose = require('mongoose');

const PostSchema = new moongose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
    },
    image: {
        type: String,
    },
}, { timestamps: true });

module.exports = moongose.model('Post', PostSchema);