const User = require('../models/user');
const jwt = require('jsonwebtoken');
const key = require('../config');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { sendMail } = require('../utils/sendMail');

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    if (err.message === 'Incorrect email') {
        errors.email = 'That email is not registered';
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'That password is incorrect';
    }

    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        return errors;
    }

    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}


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
        const user =  await newUser.save();
        await sendMail(email, 'OTP Verification', `Your OTP is ${otp}`);
        res.status(200).json({ user: user._id });
    } catch (err) {
        res.status(400).send(`Error registering user ${err}`);
    }
}

const verifyUser = async (req, res) => {
    const { otp, email } = req.body;
    console.log(otp, email);
    
    try {
        const latestUser = await User.findOne({ email }).sort({ _id: -1 });

        if (!latestUser) {
            return res.status(400).json({ errors: { verification: 'User not found' } });
        }

        if (latestUser.otp === otp) {
            latestUser.verified = true;
            latestUser.otp = undefined;
            await latestUser.save();

            const token = createToken(latestUser._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

            await User.deleteMany({ 
                email: email, 
                _id: { $ne: latestUser._id } 
            });

            return res.status(200).json({ message: 'Verification successful', user: latestUser._id });
        } else {
            return res.status(400).json({ errors: { verification: 'Invalid OTP' } });
        }
    } catch (err) {
        return res.status(500).json({ errors: { verification: `Error verifying user: ${err.message}` } });
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

const logout_get = async (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}


module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    getUserInfo,
    verifyUser,
    logout_get
}