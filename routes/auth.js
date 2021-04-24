const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/profile',authController.profile);

router.post('/inbox',authController.inbox);

router.post('/transaction',authController.transaction);

module.exports=router; 