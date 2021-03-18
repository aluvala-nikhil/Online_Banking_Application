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

module.exports=router;