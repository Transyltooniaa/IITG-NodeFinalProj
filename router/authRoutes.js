const { Router } = require('express');
const {login_get,login_post,signup_get,signup_post,getUserInfo} = require('../controller/authController'); 

const router = new Router();

router.get('/login', login_get);
router.get('/me',getUserInfo);
router.get('/signup',signup_get);
router.post('/login',login_post);
router.post('/signup',signup_post);
router.post('/register');
router.post('/verify');


module.exports = router;


