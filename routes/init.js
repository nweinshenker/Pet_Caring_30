// const sql_query = require('../sql');
const passport = require('passport');
const bcrypt = require('bcrypt');
var uuid = require('uuid');
// Postgre SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
	user: 'tarush',
	host: 'localhost',
	database: 'postgres',
	password: 'postgres',
	port: 5432,
	// connectionString: process.env.DATABASE_URL,
  //ssl: true
});

const round = 10;
const salt  = bcrypt.genSaltSync(round);

function initRouter(app) {
	/* GET */
	app.get('/'      , index );
	// app.get('/search', search);
	
	/* PROTECTED GET */
	// app.get('/dashboard', passport.authMiddleware(), dashboard);
	// app.get('/games'    , passport.authMiddleware(), games    );
	// app.get('/plays'    , passport.authMiddleware(), plays    );
	
	app.get('/register' , passport.antiMiddleware(), register );
	app.get('/login' , passport.antiMiddleware(), getlogin );
	app.get('/becomeOwner', passport.authMiddleware(), becomeOwner);
	app.get('/becomeCaretaker', passport.authMiddleware(), becomeCaretaker);
	app.get('/addlist',passport.authMiddleware(), addlist);
	// app.get('/password' , passport.antiMiddleware(), retrieve );
	
	/* PROTECTED POST */
	// app.post('/update_info', passport.authMiddleware(), update_info);
	// app.post('/update_pass', passport.authMiddleware(), update_pass);
	// app.post('/add_game'   , passport.authMiddleware(), add_game   );
	// app.post('/add_play'   , passport.authMiddleware(), add_play   );
	

	app.post('/reg_user'   , passport.antiMiddleware(), reg_user   );

	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/login',
		failureRedirect: '/login'
	}));
	
	/* LOGOUT */
	app.get('/logout', passport.authMiddleware(), logout);
}


function basic(req, res, page, other) {
	var info = {
		page: page,
		user: req.user.username,
		firstname: req.user.name,
		// lastname : req.user.lastname,
		// status   : req.user.status,
	};
	if(other) {
		for(var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}

// function query(req, fld) {
// 	return req.query[fld] ? req.query[fld] : '';
// }
// function msg(req, fld, pass, fail) {
// 	var info = query(req, fld);
// 	return info ? (info=='pass' ? pass : fail) : '';

// }

function index(req,res,next){
	res.render('index', { title: 'Express' });
}

function addlist(req,res,next){
	res.render('list', { page: 'list' , title: 'Login' });

}

function register(req,res,next){
		res.render('register', { page: 'register' , auth: false, title: 'Owner Sign Up' ,
		messages: {danger: req.flash('danger'), 
		warning: req.flash('warning'), success: req.flash('success')}});
		console.log(req.flash('warning'));
}

function reg_user(req,res,next){
	// console.log(auth);
	var sql_query = 'INSERT INTO users VALUES';
	var id  = req.body.emailid;
	var name    = req.body.Name;
	var password = req.body.password;
	var check_query = 'SELECT userid FROM users WHERE userid=' + "'"+id+"'";
	console.log(check_query);
	var pwd = bcrypt.hashSync(req.body.password, salt);
	console.log(pwd);
	var insert_query = sql_query + "('" + id + "','" + name + "','" + pwd + "')";
	pool.query(check_query, function(err, result) {
	console.log(result.rows);
	if(result.rows[0]){
	req.flash('warning', "This email address is already registered.");
	console.log("yoyoyooyooyyooyoyoyoy");
	res.redirect('/register');
	}
	else{
	pool.query(insert_query, function(err, result) {
	if(err){console.log(err);}
	else { 
	// client.query('COMMIT')
	console.log(result)
	req.flash('success','User created.')
 	res.redirect('/register');
	return;
	}
	});
	}
	});
}


function getlogin(req,res,next){
	res.render('login', { page: 'login' , auth: false, title: 'Login' ,
			messages: {danger: req.flash('danger'), 
			warning: req.flash('warning'), success: req.flash('success')}});
}


function logout(req,res,next){
	req.session.destroy();
	req.logout();
	res.redirect('/');
}

function becomeOwner(req,res,next){
	var insert_query = 'INSERT INTO owner VALUES'+"('"+req.user.username+"')";
	// console.log(req.user);
	console.log(req.user.username);
	// insert_query
	pool.query(insert_query, function(err,result){
		if(err){console.log(err);}
		else{
			console.log(result)
			res.redirect('/');
			return;
		}
	});
	// res.redirect('/login');
}

function becomeCaretaker(req,res,next){
	var insert_query = 'INSERT INTO caretaker VALUES'+"('"+req.user.username+"')";
	// console.log(req.user);
	console.log(req.user.username);
	// insert_query
	pool.query(insert_query, function(err,result){
		if(err){
			console.log(err);
			res.redirect('/');
			return;
		}
		else{
			console.log(result)
			res.redirect('/');
			return;
		}
	});
	// res.redirect('/login');
}





module.exports = initRouter;


