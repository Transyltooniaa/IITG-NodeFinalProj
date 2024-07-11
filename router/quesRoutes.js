const {Router} = require('express');
const { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion,findQuestionByTag,postQustion } = require('../controller/questionController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = new Router();

router.post('/', requireAuth, createQuestion);
router.get('/', getAllQuestions);
router.get('/postquestion',requireAuth, postQustion);
router.get('/:id', getQuestionById);
router.patch('/:id',requireAuth ,updateQuestion);
router.delete('/:id',requireAuth ,deleteQuestion);
router.get('/:tag', findQuestionByTag);

module.exports = router;
