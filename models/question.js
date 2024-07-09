const mongoose = require('mongoose');
const validator = require('validator');

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please enter a description'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    tags: {
        type: [String],
        required: [true, 'Please enter tags'],
        validate: {
            validator: function(tags) {
                return tags.length > 0;
            },
            message: 'Please enter at least one tag'
        }
    },
    answersCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Virtual for answers related to the question
questionSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'question'
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
