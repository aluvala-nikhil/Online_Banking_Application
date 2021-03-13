const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.login = async(req,res) => {
    try{
        const {email, password} =req.body;

        if(!email || !password){
            return res.ststus(400).render('login',{
                message: 'Please Provide an email and password'
            })
        }

        db.query('SELECT * FROM customer WHERE emailid=?',[email], async(error, results) =>{
            console.log(results);
            if( !results || !(await bcrypt.compare(password,results[0].password))) {
                res.status(401).render('login',{
                    message:'Email or Password is incorrect'
                })
            } else{
                const id =results[0].id;

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
                res.status(200).redirect("/")
            }
        })

    }catch(error){
        console.log(error);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const userid = req.body.userid;
    const phnumber = req.body.number;
    const email = req.body.email;
    const answer = req.body.question;
    const username = req.body.username;
    const password = req.body.password;
    const confirmPassword = req.body.password2;

    db.query('SELECT emailid FROM customer WHERE emailid = ?', [email],async (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results.length>0){
            return res.render('register',{
                message: 'email is already in use'
            })
        } else if( password !== confirmPassword){
            return res.render('register',{
                message: 'Passwords do not match'
            })
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        db.query('INSERT INTO customer SET ?', {userid :userid, phone_number:phnumber, emailid:email, securityanswer:answer, username:username, password:hashedPassword }, (error, results)=>{
            if(error){
                console.log(error);
            } else{
                console.log(results);
                return res.render('register',{
                    message: 'User Registered'
                })
            }
        })
    });
     
}