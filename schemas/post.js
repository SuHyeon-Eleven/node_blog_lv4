const mongoose = require("mongoose")

const postsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    content: {
        type: String,
    }
})

module.exports = mongoose.model('Posts', postsSchema)