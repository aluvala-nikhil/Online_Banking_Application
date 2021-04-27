const express = require('express');

const router = express.Router();

var db=require('../database');

router.get('/',(req,res) => {
    res.render('login');
})

router.get('/register',(req,res) => {
    if(req.session.loggedinUser){

        res.render('main');
        }
    else{
    res.render('register');
    }
})

router.get('/login',(req,res) => {
    if(req.session.loggedinUser){

        res.render('main');
    }
    else{
    res.render('login');
    }
})

router.get('/main',(req,res) => {
    if(req.session.loggedinUser){

    res.render('main');
    }
    else{
        res.render('login');
    }
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
        
        db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('account', {data: JSON.stringify(data)});
        });

        

    }else{
        res.redirect('/login');
    }
});

router.get('/inbox', function(req, res) {
    if(req.session.loggedinUser){
        
        db.query('SELECT * FROM messages WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err1, data1) {
                if (err) throw err;
                res.render('inbox', {data: JSON.stringify(data), data1: JSON.stringify(data1)});
            });
           
        });

    }else{
        res.redirect('/login');
    }
});

router.get('/logout',(req,res) => {
    sess=req.session;
       var data = {
           "Data":""
       };
       sess.destroy(function(err) {
           if(err){
               data["Data"] = 'Error destroying session';
               res.json(data);
           }else{
               data["Data"] = 'Session destroy successfully';
               res.redirect("/login")
               
           }
       });
       
});

router.get('/transaction/:accountno',(req,res) => {
    const accountno = req.params.accountno;
    if(req.session.loggedinUser){
        db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            db.query('SELECT * FROM transactions WHERE accountno=?',[accountno], function (err1, data1) {
                if (err1) throw err1;
                res.render('transaction', {data: JSON.stringify(data), data1: JSON.stringify(data1) });
            })
            
        });
    }
    else{
        res.render('login');
    }

})

router.get('/transaction',(req,res) => {
    if(req.session.loggedinUser){
        db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            db.query('SELECT * FROM transactions WHERE accountno=?',[data[0].accountno], function (err1, data1) {
                if (err1) throw err1;
                res.render('transaction', {data: JSON.stringify(data), data1: JSON.stringify(data1) });
            })
            
        });
    }
    else{
        res.render('login');
    }

})

router.get('/fundtransfer/:accountno',(req,res) => {
    if(req.session.loggedinUser){
        db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('fundtransfer',{data:JSON.stringify(data)})  
        
        });
        
    }
})

router.get('/homeLoan/:accountno',(req,res) => {
    const accountno = req.params.accountno;
    if(req.session.loggedinUser){
        db.query('SELECT * FROM payments WHERE accountno=?',[accountno], function (err, data) {
            if (err) throw err;
            db.query('SELECT * FROM transactions WHERE accountno=?',[accountno], function (err1, data1) {
                if (err1) throw err1;
                db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err2, data2) {
                    if (err2) throw err2;
                    res.render('homeLoan', {data: JSON.stringify(data), data1: JSON.stringify(data1) , data2: JSON.stringify(data2) });
                });
                
            })
        });
    }
    else{
        res.render('login');
    }
})

router.get('/fundtransfer',(req,res)=>{
    if(req.session.loggedinUser){
        db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('fundtransfer',{data:JSON.stringify(data)})  
        
        });
        
    }

})

router.get('/payee/:accountno',(req,res) => {
    if(req.session.loggedinUser){
        db.query('SELECT * FROM payees WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('payee',{data:JSON.stringify(data)})  
        
        });
        
    }
})

router.get('/creditCard/:accountno',(req,res) => {
    const accountno = req.params.accountno;
    if(req.session.loggedinUser){
        db.query('SELECT * FROM payments WHERE accountno=?',[accountno], function (err, data) {
            if (err) throw err;
            db.query('SELECT * FROM transactions WHERE accountno=?',[accountno], function (err1, data1) {
                if (err1) throw err1;
                db.query('SELECT * FROM accounts WHERE userid=?',[req.session.userid], function (err2, data2) {
                    if (err2) throw err2;
                    res.render('creditCard', {data: JSON.stringify(data), data1: JSON.stringify(data1) , data2: JSON.stringify(data2) });
                });
                
            })
        });
    }
    else{
        res.render('login');
    }

})
router.get('/payee',(req,res)=>{
    if(req.session.loggedinUser){
        db.query('SELECT * FROM payees WHERE userid=?',[req.session.userid], function (err, data) {
            if (err) throw err;
            res.render('payee',{data:JSON.stringify(data)})  
        
        });
        
    }
    
})



module.exports=router;