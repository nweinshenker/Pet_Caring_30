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


router.get('/logout',function(req,res){
	console.log(req.isAuthenticated());
	req.logout();
	console.log(req.isAuthenticated());
	req.flash('sucess',"Logged Out! See you soon");
	req.redirect('/login');
});