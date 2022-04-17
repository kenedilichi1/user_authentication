const express = require ('express');
const router = express.Router();
const middleware = require('../middlewares/signupMiddleWare');
const signupController = require('../controllers/signupController')

// signup route
router.post('/signup', middleware.signupValidate, signupController.signup)


// login route

router.post('/login', middleware.loginValidate,signupController.login)

module.exports = router