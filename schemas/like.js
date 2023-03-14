const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likeId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true,
        require: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        require: true
    },
    postId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        require: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
    
});

module.exports = mongoose.model('Like', likeSchema);
