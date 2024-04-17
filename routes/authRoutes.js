const express = require('express');
require('../db')
const router = express.Router()   
router.use(express.json())
const {registerController,loginController} =require('../controllers/authController')


router.post('/register',registerController)

router.post('/login',loginController)


module.exports = router