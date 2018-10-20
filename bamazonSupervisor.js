//retrieve dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
//establish mysql database connection
const connection = mysql.createConnection({
   host: 'localhost',
   port: 3306,
   user: 'root',
   password: '',
   database: 'bamazon'
})
