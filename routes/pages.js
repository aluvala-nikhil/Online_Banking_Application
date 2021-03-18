const express = require('express');

const router = express.Router();

var db=require('../database');

router.get('/',(req,res) => {
    res.render('login');
})

router.get('/register',(req,res) => {
    res.render('register');
})

router.get('/login',(req,res) => {
    res.render('login');
})

router.get('/main',(req,res) => {
    res.render('main');
})

router.get('/profile', function(req, res) {
    if(req.session.loggedinUser){
        
        db.query('SELECT * FROM customer WHERE emailid=?',[req.session.emailid], function (err, data) {
            if (err) throw err;
            res.render('profileManagement', { name: data[0].name, address: data[0].address, dob: data[0].dob, mobile: data[0].phone_number });
        });
    }else{
        res.redirect('/login');
    }
});

router.get('/account', function(req, res) {
    if(req.session.loggedinUser){
        
        db.query('SELECT * FROM accounts WHERE userid=? AND category= "savings"',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('account', { savingsAccountno: data[0].accountno, savingsBalance: data[0].balance});
        });

        

    }else{
        res.redirect('/login');
    }
});

module.exports=router;