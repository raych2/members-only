const express = require('express');
const router = express.Router();

const post_controller = require('../controllers/postController');
const user_controller = require('../controllers/userController');

router.get('/', post_controller.post_list);

router.get('/sign-up', user_controller.user_sign_up_get);
router.post('/sign-up', user_controller.user_sign_up_post);

router.get('/login', user_controller.user_login_get);
router.post('/login', user_controller.user_login_post);

router.get('/logout', user_controller.user_logout_get);

router.get('/register', user_controller.user_registration_get);
router.post('/register', user_controller.user_registration_post);

router.get('/become-admin', user_controller.user_admin_get);
router.post('/become-admin', user_controller.user_admin_post);

router.get('/create-post', post_controller.post_create_get);
router.post('/create-post', post_controller.post_create_post);

module.exports = router;
