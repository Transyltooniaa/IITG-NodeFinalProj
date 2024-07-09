const {Router} = require('express');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion,findQuestionByTag } = require('../controller/questionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = new Router();

router.post('/questions', requireAuth, createQuestion);
router.get('/questions', getAllQuestions);
router.get('/questions/:id', getQuestionById);
router.patch('/questions/:id',requireAuth ,updateQuestion);
router.delete('/questions/:id',requireAuth ,deleteQuestion);
router.get('/questions/:tag', findQuestionByTag);

module.exports = router;
