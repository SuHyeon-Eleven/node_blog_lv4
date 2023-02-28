const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true,
        require: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Posts'
    },
    user: {
        type: String,
        retuired: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

module.exports = mongoose.model('Comments', commentsSchema)