var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost', 
  user: 'root',      
  password: '',      
  database: 'online banking' 
}); 

db.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');

  
});
module.exports = db;