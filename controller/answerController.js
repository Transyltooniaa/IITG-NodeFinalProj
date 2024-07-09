const Answer = require('../models/answer');
const Question = require('../models/question');

// Create a new answer
const createAnswer = async (req, res) => {
    try {
        const answer = new Answer({
            ...req.body,
            author: req.user._id,
            question: req.params.questionId
        });
        await answer.save();

        const question = await Question.findById(req.params.questionId);
        question.answersCount += 1;
        await question.save();

        res.status(201).send(answer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all answers for a question
const getAnswersByQuestionId = async (req, res) => {
    try {
        const answers = await Answer.find({ question: req.params.questionId }).populate('author');
        res.send(answers);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update an answer
const updateAnswer = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['text', 'votes'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const answer = await Answer.findOne({ _id: req.params.id, author: req.user._id });

        if (!answer) {
            return res.status(404).send();
        }

        updates.forEach((update) => answer[update] = req.body[update]);
        await answer.save();
        res.send(answer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete an answer
const deleteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findOneAndDelete({ _id: req.params.id, author: req.user._id });

        if (!answer) {
            return res.status(404).send();
        }

        const question = await Question.findById(answer.question);
        question.answersCount -= 1;
        await question.save();

        res.send(answer);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports = {
    createAnswer,
    getAnswersByQuestionId,
    updateAnswer,
    deleteAnswer
};