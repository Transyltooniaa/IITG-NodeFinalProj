const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(email) {
                return validator.isEmail(email);
            },
            message: 'Email is invalid'
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        trim: true,
        minlength: [6, 'Minimum password length is 6 characters'],
        validate: {
            validator: function(password) {
                return !password.toLowerCase().includes('password');
            },
            message: 'Password cannot contain the word "password"'
        }
    },
    verified: { 
        type: Boolean,
         default: false 
    },
    otp: String
},{
    timestamps: true
});


// Virtual for user's questions
userSchema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'author'
});

// Virtual for user's answers
userSchema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'author'
});

// Hash the password before saving
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
  };

const User = mongoose.model('User', userSchema);
module.exports = User;
