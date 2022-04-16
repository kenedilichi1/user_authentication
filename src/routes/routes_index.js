const express = require ('express');
const router = express.Router();
const middleware = require('../middlewares/signupMiddleWare');
const signupController = require('../controllers/signupController')


router.post('/signup', middleware.signupValidate, signupController.signup)


module.exports = router