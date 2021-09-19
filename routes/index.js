const express = require('express')
const router = express.Router()

const post_controller = require('../controllers/postController')
const user_controller = require('../controllers/userController')

router.get('/', function (req, res, next) {
  res.render('layout', { title: 'Members Only' })
})

router.get('/sign-up', user_controller.user_sign_up_get)
router.post('/sign-up', user_controller.user_sign_up_post)

module.exports = router
