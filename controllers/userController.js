const User = require('../models/User');
const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const dotenv = require('dotenv').config();

exports.user_sign_up_get = function (req, res) {
  res.render('signUpForm', { title: 'Sign Up' });
};

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

exports.user_login_get = function (req, res) {
  res.render('loginForm', { title: 'Log In' });
};

exports.user_login_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
});

exports.user_logout_get = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.user_registration_get = function (req, res) {
  res.render('registration', { title: 'Become a Member' });
};

exports.user_registration_post = [
  body('membershipCode', 'Incorrect membership code entered')
    .trim()
    .isLength({ min: 1 })
    .custom((value) => value === process.env.MEMBER_CODE)
    .escape(),

  (req, res, next) => {
    const currentUser = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('registration', {
        title: 'Become a member',
        user: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      User.findByIdAndUpdate(
        currentUser.id,
        { $set: { member: true } },
        { new: true },
        function (err, user) {
          if (err) {
            return next(err);
          }
          res.render('index', { user: currentUser });
        }
      );
    }
  },
];
