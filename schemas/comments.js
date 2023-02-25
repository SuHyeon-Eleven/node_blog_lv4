const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: String,
        retuired: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Comments',commentsSchema)