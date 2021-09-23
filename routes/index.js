const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');

// GET home page.
router.get('/', function (req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/sign-up', user_controller.user_sign_up_get);
router.post('/sign-up', user_controller.user_sign_up_post);

router.get('/login', user_controller.user_login_get);
router.post('/login', user_controller.user_login_post);

router.get('/logout', user_controller.user_logout_get);

router.get('/register', user_controller.user_registration_get);
router.post('/register', user_controller.user_registration_post);

module.exports = router;
