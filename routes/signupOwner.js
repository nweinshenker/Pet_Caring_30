var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
var flash = require('connect-flash');
const { Pool } = require('pg')
const pool = new Pool({
  user: 'tarush',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
})


var sql_query = 'INSERT INTO users VALUES';

// var my_query = 'SELECT * FROM student_info';
router.get('/', function(req, res, next) {
	// pool.query(my_query, (err, data) => {
	// 	console.log(data.rows);
	// });
	res.render('signupOwner', { title: 'Owner Sign Up' ,
		messages: {danger: req.flash('danger'), 
		warning: req.flash('warning'), success: req.flash('success')}});
	console.log(req.flash('warning'));
});


router.post('/', async function(req, res, next) {
	// Retrieve Information
	var id  = req.body.emailid;
	var name    = req.body.Name;
	var password = req.body.password;
	// console.log(id);
	// Construct Specific SQL Query
	// var insert_query = sql_query + "('" + id + "','" + name + "','" + password + "')";
	// console.log(insert_query);
	// pool.query(insert_query, (err, data) => {
	// 	res.redirect('/signupOwner')
	// });


	var check_query = 'SELECT userid FROM users WHERE userid=' + "'"+id+"'";
	console.log(check_query);
	var pwd = await bcrypt.hash(req.body.password, 4);
	console.log(pwd);
	var insert_query = sql_query + "('" + id + "','" + name + "','" + pwd + "')";
	await JSON.stringify(pool.query(check_query, function(err, result) {
	console.log(result.rows);
	if(result.rows[0]){
	req.flash('warning', "This email address is already registered.");
	console.log("yoyoyooyooyyooyoyoyoy");
	res.redirect('/signupOwner');
	}
	else{
	pool.query(insert_query, function(err, result) {
	if(err){console.log(err);}
	else { 
	// client.query('COMMIT')
	console.log(result)
	req.flash('success','User created.')
 	res.redirect('/signupOwner');
	return;
	}
	});
	}
	}));


});


module.exports = router;
