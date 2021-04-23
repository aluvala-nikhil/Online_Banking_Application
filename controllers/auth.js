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
            db.query("DELETE from messages where message_id=?",[req.body['array[]'][i]], function(err,data){
                if (err) throw err;
            })
        }
        res.status(200).redirect("/inbox")
    }
    
    
    
}
