const User = require('../models/User');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Display User sign up form on GET.
exports.user_sign_up_get = function (req, res) {
  res.render('signUpForm', { title: 'Sign Up' });
};

// Handle User sign up on POST.
exports.user_sign_up_post = [
  body('firstName', 'First name required').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'Last name required').trim().isLength({ min: 1 }).escape(),
  body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
  body('password', 'Password required').trim().isLength({ min: 1 }).escape(),
  body(
    'passwordConfirmation',
    'Password confirmation must have the same value as password'
  )
    .trim()
    .isLength({ min: 1 })
    .custom((value, { req }) => value === req.body.password)
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('signUpForm', {
        title: 'Sign Up',
        user: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      bcrypt.hash(String(req.body.password), 10, (err, hashedPassword) => {
        const user = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
        });
        user.save(function (err) {
          if (err) {
            return next(err);
          }
          res.redirect('/login');
        });
      });
    }
  },
];

// Display User login form on GET.
exports.user_login_get = function (req, res) {
  res.render('loginForm', { title: 'Log In' });
};

// Handle User login form on POST.
exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect('/');
};
