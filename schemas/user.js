const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        default: mongoose.Types.ObjectId,
        unique: true,
        require: true
    },
    password: {
        type: String,
    },
    nickname: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('User', userSchema);
