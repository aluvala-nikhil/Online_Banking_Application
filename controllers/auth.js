const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { request } = require("express");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.login = async(req,res) => {
    try{
        const {email,password} =req.body;

        if(!email || !password){
            return res.status(400).render('login',{
                message: 'Please Provide an email and password'
            })
        }

        db.query('SELECT * FROM customer WHERE emailid=?',[email], async(error, results) =>{
            if(results.length != 0){
                console.log(results)
                if( !results || !(await bcrypt.compare(password,results[0].password))) {
                    res.status(401).render('login',{
                        message:'Email or Password is incorrect'
                    })
                } else{
                    const id =results[0].userid;
            
                    const token = jwt.sign({id :id}, process.env.JWT_SECRET,{
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
            
                    const cookiesOptions = {
                        expires: new Date(
                            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                        ),
                        httpOnly:true
                    }
            
                    res.cookie('jwt', token, cookiesOptions);
            
                    req.session.loggedinUser= true;
                    req.session.emailid = results[0].emailid;
                    req.session.userid = results[0].userid;
            
                    res.status(200).redirect("/main")
                }
            }
            
            else{
                db.query('SELECT * FROM customer WHERE username=?',[email], async(error, results) =>{
                    console.log(results)
                    if( results.length ==0 || !(await bcrypt.compare(password,results[0].password))) {
                        res.status(401).render('login',{
                            message:'Email or Username or Password is incorrect'
                        })
                    } else{
                        const id =results[0].userid;
                
                        const token = jwt.sign({id :id}, process.env.JWT_SECRET,{
                            expiresIn: process.env.JWT_EXPIRES_IN
                        });
                
                        const cookiesOptions = {
                            expires: new Date(
                                Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                            ),
                            httpOnly:true
                        }
                
                        res.cookie('jwt', token, cookiesOptions);
                
                        req.session.loggedinUser= true;
                        req.session.emailid = results[0].emailid;
                        req.session.userid = results[0].userid;
                
                        res.status(200).redirect("/main")
                    }
                    
                })
            }
            
        })
        

    }catch(error){
        console.log(error);
    }
}

    


exports.register = (req, res) => {
    

    const userid = req.body.userid;
    const phnumber = req.body.number;
    const email = req.body.email;
    const answer = req.body.question;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.password2;
    

    if(userid==''){
        return res.render('register',{
            message: 'Enter the User ID'
        })
    } else{ if( phnumber == ''){
                return res.render('register',{
                    message: 'Enter The Phone Number'
                })
            }
            else if( email == ''){
                return res.render('register',{
                    message: 'Enter The Email'
                })
            }
    }

    db.query('SELECT emailid,phone_number,userid,securityanswer,username FROM customer WHERE userid = ?', [userid],async (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results.length==0){
            return res.render('register',{
                message: 'User ID does not exist'
            })
        } 
        
        if(results[0].username!=""){
            return res.render('register',{
                message: 'Userid already registered'
            })
        }

        if(phnumber!=results[0].phone_number){
            return res.render('register',{
                message: 'Enter the Registered Phone Number'
            })
        }

        if(email!=results[0].emailid){
            return res.render('register',{
                message: 'Enter the Registered Email Address'
            })
        }

        if(answer!=results[0].securityanswer){
            return res.render('register',{
                message: 'Enter the Correct Security Answer'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        
        db.query('UPDATE customer SET ? WHERE userid = ?', [{ username:username, password:hashedPassword},[userid]], (error, results)=>{
            if(error){
                console.log(error);
            } else{
                return res.render('register',{
                    message: 'User Registered'
                })
                
            }
        })
    });
     
}

exports.profile = (req,res)=> {

    const name = req.body.name;
    const dob = req.body.dob;
    const phnumber = req.body.mobile;
    const address = req.body.address;
    const current_password = req.body.current_password;
    const new_password = req.body.new_password;
    if(current_password==new_password && current_password==''){
        
        db.query('UPDATE customer SET ? WHERE emailid = ?', [{ name:name,dob:dob,phone_number:phnumber,address:address},[req.session.emailid]],async (error, results) =>{
            if(error){
                console.log(error);
            } else{
                
                res.status(200).redirect("/profile")
            }
        });
    }
    else{
        
        
        try{
           
    
            db.query('SELECT password FROM customer WHERE emailid=?',[req.session.emailid], async(error, results) =>{
                
                if((await bcrypt.compare(current_password,results[0].password))) {
                    let hashedPassword = await bcrypt.hash(new_password, 8);
                    db.query('UPDATE customer SET ? WHERE emailid = ?', [{ name:name,dob:dob,phone_number:phnumber,address:address,password:hashedPassword},[req.session.emailid]],async (error, results) =>{
                        if(error){
                            console.log(error);
                        } else{
                            db.query('SELECT * FROM customer WHERE emailid=?',[req.session.emailid], function (err, data) {
                                if (err) throw err;
                                res.render('profileManagement', { name: data[0].name, address: data[0].address, dob: data[0].dob, mobile: data[0].phone_number,message:'Password Updated' });
                            });
                            
                        }
                    });
                } else{
                    db.query('SELECT * FROM customer WHERE emailid=?',[req.session.emailid], function (err, data) {
                        if (err) throw err;
                        res.render('profileManagement', { name: data[0].name, address: data[0].address, dob: data[0].dob, mobile: data[0].phone_number,message:'Entered Current Password is wrong' });
                    });
                }
            })
    
        }catch(error){
            console.log(error);
        }

        

    }
    
    
}


exports.inbox = (req,res) =>{
    
    if(req.body.del == "N"){
        db.query("SELECT unread from messages where message_id =?",[req.body.id], function(err,data){
            if (data[0].unread=="Y"){
                db.query("UPDATE messages SET unread=? where message_id=?",[["N"],[req.body.id]], function(err,data){
                    if (err) throw err;
                    res.status(200).redirect("/inbox")
                })
            }
            else {
                db.query("UPDATE messages SET unread=? where message_id=?",[["Y"],[req.body.id]], function(err,data){
                    if (err) throw err;
                    res.status(200).redirect("/inbox")
                })
            }
            
        })
    }
    else{
        
        for(i=0;i<req.body['array[]'].length;i++){
            console.log(req.body['array[]'][i]);
            db.query("DELETE from messages where message_id=?",[req.body['array[]'][i]], function(err,data){
                if (err) throw err;
            })
        }
        res.status(200).redirect("/inbox")
    }
    
    
    
}

exports.transaction = (req,res) =>{
    if(req.session.loggedinUser){
        if(typeof req.body.trans_date_from != 'undefined' && req.body.trans_date_to != 'undefined' && req.body.trans_date_from !== null && req.body.trans_date_to !== null){
            db.query('SELECT * FROM transactions WHERE accountno=? and date >=? and date<? and payment_type=?',[[req.body.Account_number],[req.body.trans_date_from],[req.body.trans_date_to],[req.body.trans_category]], function (err, data) {
                res.send(JSON.stringify(data.reverse()))
            });
        }
        else if(typeof req.body.trans_period_value != 'undefined' && req.body.trans_period_value !== null){
            db.query('select * from transactions where accountno=? and date >= date_sub(now(),interval ? month) and payment_type=?',[[req.body.Account_number],[req.body.trans_period_value],[req.body.trans_category]], function (err, data) {
                res.send(JSON.stringify(data.reverse()))
            });
        }
        else if(typeof req.body.trans_count_value != 'undefined' && req.body.trans_count_value !== null){
            db.query('select * from transactions where accountno=? and payment_type=?',[[req.body.Account_number],[req.body.trans_category]], function (err, data) {
                data=data.reverse();
                if(data.length<req.body.trans_count_value){
                    req.body.trans_count_value=data.length
                    console.log(req.body.trans_count_value)
                }

                data.splice(req.body.trans_count_value, data.length-req.body.trans_count_value);
                console.log(data)
                res.send(JSON.stringify(data))
            });
        }

    }
    else{
        res.render('login');
    }
}

exports.payee  = (req,res) =>{
    if(req.session.loggedinUser){
        const name = req.body.name;
        const bank_name = req.body.bank_name;
        const branch_name = req.body.branch_name;
        const account_number = req.body.account_number;
        const ifsc_code = req.body.ifsc_code;
        db.query('INSERT INTO payees SET ?',[{userid:req.session.userid,accountnumber:account_number,name:name,bankname:bank_name,branchname:branch_name,ifsc_code:ifsc_code}], function (err, data) {
            if (err) throw err;
            res.status(200).redirect("/payee")
        });


    }
}

exports.fundtransfer = (req,res) =>{
    const transfer_type = req.body.transfer_type
    const accno = req.body['acc[]']
    const description = req.body.description
    const amount =req.body.amount
    const toaccno = req.body.to_acc

    if(transfer_type == "Transfer_Now"){
        db.query('SELECT balance FROM accounts WHERE accountno = ?',[accno], function (err, bal) {
            db.query('SELECT balance FROM accounts WHERE accountno = ?',[toaccno], function (err, bal1) {
                if (bal[0].balance >= amount){
                    db.query('INSERT INTO transactions SET ?',[{transtype:"fundtransfer",amount:amount,description:description,payment_type:"debit",accountno:accno}], function (err, data) {
                        if (err) throw err;
                    });
                    db.query('UPDATE accounts SET ? where accountno = ?',[{balance:bal[0].balance-amount},[accno]], function (err, data) {
                        if (err) throw err;
                    });

                    db.query('SELECT max(transid) max FROM transactions where accountno = ?',[accno], function (err, d) {
                        db.query('UPDATE accounts SET ? where accountno = ?',[{balance:+bal1[0].balance + +amount},[toaccno]], function (err, data) {
                            if (err) throw err;
                        });
                        db.query('INSERT INTO transactions SET ?',[{transtype:"fundtransfer",amount:amount,description:description,payment_type:"credit",accountno:toaccno}], function (err, data) {
                            if (err) throw err;
                        });
                        db.query('UPDATE transactions SET ? where transid in (SELECT max(transid) FROM transactions) ',[{transid : d[0].max}], function (err, data) {
                            if (err) throw err;
                        });

                        res.send(JSON.stringify("Fund transaction Successful , transaction id is "+d[0].max))

                    });
                    
                    
                 }
                else{
                    res.send(JSON.stringify("no sufficient balance"))
                }
            });
        }); 
    }
    else{

    }
}

exports.submitQuery = (req,res) =>{
    if(req.session.loggedinUser){
        db.query('INSERT INTO queries(Query, accountno, subject) VALUES (?,?,?) ', [[req.body.message],[req.body.account_number],[req.body.subject]], function (err, data) {
            if (err) throw err;
            res.send(JSON.stringify("Query Sumbitted Successfully"))
        });
    }
    else{
        res.render('login');
    }
}

exports.Queries = (req,res) =>{
    if(req.session.loggedinUser){
        db.query("SELECT * from queries where accountno= ?",[req.body.account_number], function(err,data){
            if (err) throw err;
            res.send(JSON.stringify(data))
        });
    }
    else{
        res.render('login');
    }
}

exports.deletePayee = (req,res) =>{
    db.query("DELETE from payees where accountnumber=?",[req.body.accountno], function(err,data){
        if (err){
            res.send(JSON.stringify("Delete Payee Failed"))
        }else{
            res.send(JSON.stringify("Delete Payee Successful"))
        }

    }) 
}


exports.homeLoanPayment = (req,res) =>{
    if(req.session.loggedinUser){
        db.query("SELECT * from accounts where accountno= ?",[req.body.accountno], function(err,data){
            if (err) throw err;
            
            db.query("SELECT * from payments where accountno= ?",[req.body.loan_accountno], function(err1,data1){
                if (err1) throw err1;

                if(data[0].balance>=data1[0].amount){
                    db.query("UPDATE accounts SET balance=? where accountno=?",[[data[0].balance - data1[0].amount],[req.body.accountno]], function(err2,data2){
                        if (err2) throw err2;
                        db.query("UPDATE accounts SET balance= balance-? where accountno=?",[[data1[0].amount],[req.body.loan_accountno]], function(err5,data5){
                            if (err5) throw err5;
                            db.query("INSERT INTO transactions(transtype, amount, description, payment_type, accountno) VALUES (?,?,?,?,?) ",[["payment"],[20000],["Home Loan Amount"],["debit"],[req.body.loan_accountno]], function(err3,data3){
                                if (err3) throw err3;
                                db.query("INSERT INTO transactions(transtype, amount, description, payment_type, accountno) VALUES (?,?,?,?,?) ",[["payment"],[20000],["For Home Loan"],["debit"],[req.body.accountno]], function(err4,data4){
                                    if (err4) throw err4;
                                    res.send(JSON.stringify("Loan Payment Succeeded"))
                                });
                            });
                        });
                    });
                }
                else{
                    res.send(JSON.stringify("Loan Payment Failed  due to Insufficient Balance"))
                }
            });
        });
    }
    else{
        res.render('login');
    }
}

exports.creditCardPayment = (req,res) =>{
    if(req.session.loggedinUser){
        db.query("SELECT * from accounts where accountno= ?",[req.body.accountno], function(err,data){
            if (err) throw err;
            
            db.query("SELECT * from payments where accountno= ?",[req.body.credit_accountno], function(err1,data1){
                if (err1) throw err1;

                if(data[0].balance>=data1[0].amount){
                    db.query("UPDATE accounts SET balance=? where accountno=?",[[data[0].balance - data1[0].amount],[req.body.accountno]], function(err2,data2){
                        if (err2) throw err2;
                        db.query("UPDATE accounts SET balance=balance-? where accountno=?",[[data1[0].amount],[req.body.credit_accountno]], function(err5,data5){
                            if (err5) throw err5;
                            db.query("INSERT INTO transactions(transtype, amount, description, payment_type, accountno) VALUES (?,?,?,?,?) ",[["payment"],[20000],["Credit Card Payment"],["debit"],[req.body.credit_accountno]], function(err3,data3){
                                if (err3) throw err3;
                                db.query("INSERT INTO transactions(transtype, amount, description, payment_type, accountno) VALUES (?,?,?,?,?) ",[["payment"],[20000],["For Credit Crad"],["debit"],[req.body.accountno]], function(err4,data4){
                                    if (err4) throw err4;
                                    res.send(JSON.stringify("Credit Card Payment Succeeded"))
                                });
                            });
                        });
                    });
                }
                else{
                    res.send(JSON.stringify("Credit Crad Payment Failed  due to Insufficient Balance"))
                }
            });
        });
    }
    else{
        res.render('login');
    }
}

exports.deleteAccount = (req,res) =>{
    if(req.session.loggedinUser){
        console.log(req.body.accountno)
        db.query("SELECT * from accounts where accountno= ?",[req.body.accountno], function(err,data){
            if(data[0].balance==0){
                db.query("DELETE from accounts where accountno=?",[req.body.accountno], function(err1,data1){
                    if (err){
                        res.send(JSON.stringify("Delete Account Failed"))
                    }else{
                        res.send(JSON.stringify("Delete Account Successfully"))
                    }
                    
                }) 
            }
            else{
                res.send(JSON.stringify("Contact Customer Care"))
            }
        });
    }
    else{
        res.render('login');
    }
}
