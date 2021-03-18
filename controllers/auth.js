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
            return res.status(400).render('login',{
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

                sess = req.session;
                sess.email = req.body.email;
                sess.userid = results[0].userid;
                console.log(sess);
                res.status(200).redirect("/main")
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

    db.query('SELECT emailid,phone_number,userid,securityanswer FROM customer WHERE userid = ?', [userid],async (error, results) =>{
        if(error){
            console.log(error);
        }

        if(results.length==0){
            return res.render('register',{
                message: 'User ID does not exist'
            })
        } 
        if(results[0].username!=''){
            return res.render('register',{
                message: 'Userid already registerd'
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
        console.log(hashedPassword);
        
        db.query('UPDATE customer SET ? WHERE userid = ?', [{ phone_number:phnumber, emailid:email, securityanswer:answer, username:username, password:hashedPassword},[userid]], (error, results)=>{
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