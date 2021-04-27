const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/profile',authController.profile);

router.post('/inbox',authController.inbox);

router.post('/transaction',authController.transaction);

router.post('/payee',authController.payee);

router.post('/fundtransfer',authController.fundtransfer);

router.post('/submitQuery',authController.submitQuery);

router.post('/Queries',authController.Queries);

router.post('/homeLoanPayment',authController.homeLoanPayment);

router.post('/creditCardPayment',authController.creditCardPayment);

router.post('/deleteAccount',authController.deleteAccount);

module.exports=router; 