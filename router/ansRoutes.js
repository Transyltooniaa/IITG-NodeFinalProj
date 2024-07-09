const {Router} = require('express');
const { createAnswer, getAnswersByQuestionId, updateAnswer, deleteAnswer } = require('../controller/answerController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = new Router();

router.post('/questions/:questionId/answers',requireAuth ,createAnswer);
router.get('/questions/:questionId/answers', getAnswersByQuestionId);
router.patch('/answers/:id',requireAuth ,updateAnswer);
router.delete('/answers/:id',requireAuth ,deleteAnswer);

module.exports = router;
