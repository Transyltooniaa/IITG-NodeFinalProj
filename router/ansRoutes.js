const {Router} = require('express');
const { createAnswer, getAnswersByQuestionId, updateAnswer, deleteAnswer } = require('../controller/answerController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = new Router();

router.post('/:questionId',requireAuth ,createAnswer);
router.get('/:questionId', getAnswersByQuestionId);
router.patch('/:id',requireAuth ,updateAnswer);
router.delete('/:id',requireAuth ,deleteAnswer);

module.exports = router;
