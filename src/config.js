const mysql = require("mysql2")
require('dotenv').config();

const con = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME

});

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Data Base Connected Sucessfully");
    }
});

module.exports.con = con;