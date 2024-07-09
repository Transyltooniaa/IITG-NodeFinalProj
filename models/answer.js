const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    
}, {
    timestamps: true
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
