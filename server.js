// const request=require('request');
// const express=require('express');
// const cors=require('cors');

// const axios = require('axios');
const mysql=require('mysql');


// const app=express();
// app.use(express.json());
// app.use(cors());

const connection =mysql.createConnection({
    host:'localhost',
    port:3306,
    database:'sirplus',
    user:'root',
    password:'root' 
});

connection.connect(function (err){
    if(err){
        console.log('Error ',err.message);
    }else{
        console.log('connected');
        var sql = "INSERT INTO tbltest (sName,sPassword) VALUES ('Ajeet Kumar', 'Allahabad')";  
        connection.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("1 record inserted");  
        });  
    }
});


