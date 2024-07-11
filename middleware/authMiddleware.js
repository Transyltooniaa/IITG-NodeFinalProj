const jwt = require('jsonwebtoken');
const User = require('../models/user');
const keys = require('../config');
const cookieParser = require('cookie-parser');

const requireAuth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
      try {
          const decodedToken = jwt.verify(token, keys.jwtSecret);
          const user = await User.findById(decodedToken.id);

          if (!user) {
              throw new Error('User not found');
          }

          req.user = user;
          next();
      } catch (err) {
          console.log(err.message);
          res.redirect('api/auth/login');
      }
  } else {
      res.redirect('api/auth/login');
  }
};




// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token,keys.jwtSecret , async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };