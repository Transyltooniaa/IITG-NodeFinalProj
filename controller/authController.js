const User = require('../models/user');
const jwt = require('jsonwebtoken');
const key = require('../config');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const maxAge = 3 * 24 * 60 * 60;

const signup_get = async (req, res) => {
    res.render('signup');
}

const login_get = async (req, res) => {
    res.render('login');
}

const signup_post = async (req, res) => {
    const { email, username, password } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = new User({ email, username, password, otp });

    try {
        await newUser.save();
        await sendMail(email, 'OTP Verification', `Your OTP is ${otp}`);
        res.status(201).send('User registered! Please verify your email.');
    } catch (err) {
        res.status(400).send(`Error registering user ${err}`);
    }
}


exports.verifyUser = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const latestUser = await User.findOne({ email }).sort({ _id: -1 });

        if (!latestUser) {
            throw new Error('User not found');
        }

        if (latestUser.otp === otp) {
            latestUser.verified = true;
            latestUser.otp = undefined;
            await latestUser.save();

            await User.deleteMany({ 
                email: email, 
                _id: { $ne: latestUser._id } 
            });

            return res.status(200).redirect('/login');
        } else {
            return res.status(400).send('Invalid OTP');
        }
    } catch (err) {
        return res.status(400).send(`Error verifying user: ${err.message}`);
    }
};




const createToken = (id) => {
    return jwt.sign({ id }, key.jwtSecret , { expiresIn: maxAge });
}



const login_post = async (req, res) => {
const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}


const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send('Error retrieving user info');
    }
};


module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    getUserInfo,
}