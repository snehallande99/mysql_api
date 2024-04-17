const express=require('express')
const {register}=require('../controllers/postcontroller')
const router=express.Router();

router.get('/',register)

module.exports=router