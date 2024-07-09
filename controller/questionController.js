const Question = require('../models/question');
const Answer = require('../models/answer');

// Create a new question
const createQuestion = async (req, res) => {
    try {
        const question = new Question({
            ...req.body,
            user: req.user._id
        });
        await question.save();
        res.status(201).send(question);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate('user').populate('answers');
        res.send(questions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id).populate('user').populate('answers');
        if (!question) {
            return res.status(404).send();
        }
        res.send(question);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a question
const updateQuestion = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'tags', 'votes'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const question = await Question.findOne({ _id: req.params.id, user: req.user._id });

        if (!question) {
            return res.status(404).send();
        }

        updates.forEach((update) => question[update] = req.body[update]);
        await question.save();
        res.send(question);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a question
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findOneAndDelete({ _id: req.params.id, user: req.user._id });

        if (!question) {
            return res.status(404).send();
        }

        res.send(question);
    } catch (error) {
        res.status(500).send(error);
    }
};

const findQuestionByTag = async (req, res) => {
    try {
        const questions = await Question.find({ tags: req.params.tag }).populate('user').populate('answers');
        res.send(questions);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    findQuestionByTag
};
