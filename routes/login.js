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
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;



////////
passport.use('local', new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => {
 console.log("INSIDE PASSPORT 0000000");
 loginAttempt();
 async function loginAttempt() {
 console.log("INSIDE PASSPORT");
 var check_query = 'SELECT userid, name, password FROM users WHERE userid=' + "'"+username+"'";
 const client = await pool.connect()
 try{
 await client.query('BEGIN')
 var currentAccountsData = await
  JSON.stringify(client.query
  	(check_query, function(err, result) {
 console.log(result.rows);
 if(err) {
 return done(err)
 } 
 if(result.rows[0] == null){
 req.flash('danger', "Oops. Incorrect login details.");
 return done(null, false);
 }
 else{
 bcrypt.compare(password, result.rows[0].password, function(err, check) {
 if (err){
 console.log('Error while checking password');
 return done();
 }
 else if (check){
 return done(null, [{email: result.rows[0].email, name: result.rows[0].name}]);
 }
 else{
 req.flash('danger', "Oops. Incorrect login details.");
 return done(null, false);
 }
 });
 }
 }))
 }
 
 catch(e){throw (e);}
 };
 
}
))
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});



///////


router.get('/', function(req, res, next) {
	// pool.query(my_query, (err, data) => {
	// 	console.log(data.rows);
	// });
	if (req.isAuthenticated()) {
	res.redirect('/');
	}
	else
	{
		// console.log("get here ahahahahahahahah");
		res.render('login', { title: 'Login' ,
			messages: {danger: req.flash('danger'), 
			warning: req.flash('warning'), success: req.flash('success')}});
	// console.log(req.flash('warning'));
	}
});


router.post('/', passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/login',
 failureFlash: true
 }), function(req, res) {
 	console.log("here ahahahahahahahah");
 if (req.body.remember) {
 req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
 } else {
 req.session.cookie.expires = false; // Cookie expires at end of session
 }
 res.redirect('/');
 });

module.exports = router;

