const Post = require('../models/Post');
const { body, validationResult } = require('express-validator');

exports.post_list = function (req, res) {
  Post.find({})
    .sort('-createdAt')
    .populate('user')
    .exec(function (err, list_posts) {
      if (err) {
        return next(err);
      }
      res.render('index', { post_list: list_posts, user: req.user });
    });
};

exports.post_create_get = (req, res, next) => {
  res.render('createPostForm', { title: 'Create a Post', user: req.user });
};

exports.post_create_post = [
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('message', 'Message must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('createPostForm', {
        title: 'Create a Post',
        post: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      const post = new Post({
        title: req.body.title,
        user: req.user._id,
        message: req.body.message,
        timestamps: true,
      });
      post.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    }
  },
];

exports.post_delete = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, function deletePost(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};
