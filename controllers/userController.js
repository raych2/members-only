const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');

exports.user_sign_up_get = function (req, res) {
  res.render('signUpForm', { title: 'Sign up' });
};

exports.user_sign_up_post = [
  body('firstName', 'First name required').trim().isLength({ min: 1 }).escape(),
  body('lastName', 'Last name required').trim().isLength({ min: 1 }).escape(),
  body('username', 'Username required')
    .trim()
    .isLength({ min: 1 })
    .custom((value) => {
      return User.find({ username: value }).then((user) => {
        if (user.length > 0) {
          return Promise.reject(
            'Username already in use. Please choose another username.'
          );
        }
      });
    })
    .escape(),
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
        title: 'Sign up',
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
  res.render('loginForm', { title: 'Log in' });
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
  res.render('registration', { title: 'Become a Member', user: req.user });
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
        title: 'Become a Member',
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
          res.redirect('/');
        }
      );
    }
  },
];

exports.user_admin_get = function (req, res) {
  res.render('admin', { title: 'Become an Admin', user: req.user });
};

exports.user_admin_post = [
  body('adminCode', 'Incorrect admin code entered')
    .trim()
    .isLength({ min: 1 })
    .custom((value) => value === process.env.ADMIN_CODE)
    .escape(),

  (req, res, next) => {
    const currentUser = req.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('admin', {
        title: 'Become an Admin',
        user: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      User.findByIdAndUpdate(
        currentUser.id,
        { $set: { admin: true } },
        { new: true },
        function (err, user) {
          if (err) {
            return next(err);
          }
          res.redirect('/');
        }
      );
    }
  },
];
