// const sql_query = require('../sql');
const passport = require('passport');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
// Postgres SQL Connection
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

const round = 10;
const salt = bcrypt.genSaltSync(round);

function initRouter(app) {
	/* GET */
	app.get('/', index);
	app.get('/register', passport.antiMiddleware(), register);
	app.get('/login', passport.antiMiddleware(), getlogin);
	app.get('/setsession', passport.authMiddleware(), setsession);

	// app.get('/findsitter',passport.authMiddleware(), getsitter);
	/* List all CareTakers in a Table */
	app.get('/getcare', passport.authMiddleware(), getcare);
	app.get('/findcare', passport.authMiddleware(), findcare);
	
	/* PROTECTED POST */
	// app.post('/update_info', passport.authMiddleware(), update_info);
	// app.post('/update_pass', passport.authMiddleware(), update_pass);
	// app.post('/add_game'   , passport.authMiddleware(), add_game   );
	// app.post('/add_play'   , passport.authMiddleware(), add_play   );


	app.post('/postlist', passport.authMiddleware(), postlist);
	app.post('/postpet', passport.authMiddleware(), postpet);
	


	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/setsession',
		failureRedirect: '/login'
	}));
	app.post('/reg_user', passport.antiMiddleware(), reg_user);
	/* LOGOUT */
	app.get('/logout', passport.authMiddleware(), logout);
	app.get('/getbid', passport.authMiddleware(), getbid);
	app.post('/postbid', passport.authMiddleware(), postbid);
}


////res.session.status variable defined 
//// value : none / caretaker / owmner / both

///Still not used
function basic(req, res, page, other) {
	var info = {
		page: page,
		user: req.user.username,
		firstname: req.user.name,
		// lastname : req.user.lastname,
		// status   : req.user.status,
	};
	if (other) {
		for (var fld in other) {
			info[fld] = other[fld];
		}
	}
	res.render(page, info);
}






///home
function index(req, res, next) {
	console.log(req.session.status);
	res.render('index', { title: 'Express' });
}


/////Adding availability in table list
function getlist(req,res,next){
	// console.log(req.session.status);
	if (!(req.session.status == 'caretaker' || req.session.status == 'both' ))
	{	
		res.redirect('/');
	}
	else

	{
		var provided_services= "select P.serviceId as serviceId, S.name as name from (caretaker C natural join provides P) natural join services S where C.caretakerId ='"+req.user.username+"'"
		// service_query= 'Select * from services where '
		pool.query(provided_services, function(err,result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
				return;
			}
			else
			{
				res.render('list', { page: 'list' , title: 'Add Availability' , services: result.rows});
			}
		});
		// console.log(provided_services);
		// console.log(":::::"+provided_services[1].name);
		
	}


}

function postlist(req, res, next) {
	// console.log('hahahahaha');
	if (!(req.session.status === 'caretaker' || req.session.status === 'both' ))
	{	
		res.redirect('/');
	}
	else
	{
		var genid = uuidv4();
		console.log(req.user);
		var sql_query = 'INSERT INTO list VALUES';
		var id = req.user.username;
		//check for services
		sql_query = sql_query + "('" + genid + "','" +id + "','"+ req.body.service+ "','" + req.body.price+ "','" + req.body.day  + "')";
		pool.query(sql_query, function (err, result) {
			if (err){
				console.log(err);
				res.redirect('/');
				return;
			}
			else {
				console.log(result);
				res.redirect('/');
			}
		});
	}
	// res.redirect('/');
}


function getpet(req, res, next) {
	// console.log("inside get pettttt" + req.session.status);
	if (!(req.session.status == 'owner' || req.session.status == 'both' ))
	{	
		console.log('not a owner yet');
		res.redirect('/');
		return;
	}
	else
	{
		search_pet = "BEGIN;";
		search_pet += "Select * from petowned P natural join cat C where P.ownerId = '"+req.user.username+"';";
		search_pet += "Select * from petowned P natural join dog D where P.ownerId = '"+req.user.username+"';";
		search_pet += "END;"
		console.log("search_pet::::::::::::::::::"+search_pet);
		pool.query(search_pet , function (err, result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
				return;
			}
			else
			{
				var dogs = result[2].rows;
				var cats = result[1].rows;
				console.log(dogs)
				console.log(cats);
				console.log(cats[0].petnum);
				res.render('ownerprofile', { page: 'ownerprofile' , title: 'Owner', cats: result[1].rows, dogs: result[2].rows });
			}
		});
	}
}

function getpet(req, res, next) {
	// console.log("inside get pettttt" + req.session.status);
	if (!(req.session.status === 'owner' || req.session.status === 'both' ))
	{	
		res.redirect('/');
	}
	else
		res.render('addpet', { page: 'addpet', title: 'Add Pet' });
}

function postpet(req, res, next) {
	
	if (!(req.session.status === 'owner' || req.session.status === 'both' ))
	{	
		res.redirect('/');
	}
	else
	{
	console.log(req.body.catordog);
	// console.log(req.user);
	var sql_query = 'BEGIN; INSERT INTO petowned VALUES';
	var id  = req.user.username;
	var genid = uuidv4();
	console.log(genid+"::::::::genid");
	// var name    = req.user.Name;
	// var password = req.user.password;
	sql_query = sql_query+"('"+genid+"','"+req.body.pname+"','"+id+"','"+req.body.age+"');";

	if(req.body.catordog === 'dog')
	{
		var pet_query = 'INSERT INTO dog VALUES';
		pet_query = pet_query+ "('"+genid+"','"+id+"','"+req.body.size+"','"+req.body.breed+"','"+req.body.temper+"')";
	}
	else if(req.body.catordog === 'cat')
	{
		var pet_query = 'INSERT INTO cat VALUES';
		pet_query = pet_query+ "('"+genid+"','"+id+ "','"+ req.body.breed+"')";
	}
	console.log("yoyooyoyoyoyoyoyooyoy" + pet_query);

	sql_query = sql_query + pet_query + ";END;";
	console.log(sql_query);
	  pool.query(sql_query,function(err,result){
		if(err)
			console.log(err);
		else {
			console.log(result);
			res.redirect('/');
		}
	});
	}
}



//Adding to caretaker or owner table
function becomeOwner(req, res, next) {


	// if(res.session == )

	var insert_query = `INSERT INTO owner VALUES('${req.user.username}')`;
	// console.log(req.user);
	console.log(req.user.username);
	// insert_query
	pool.query(insert_query, function (err, result) {
		if (err) 
		{ 
			console.log(err);
			res.redirect('/');
			return;
		}
		else {
			console.log(result);
			res.redirect('/');
		}
	});
	// res.redirect('/login');
}

function becomeCaretaker(req, res, next) {
	var insert_query = `INSERT INTO caretaker VALUES('${req.user.username}')`;
	// console.log(req.user);
	console.log(req.user.username);
	// insert_query
	pool.query(insert_query, function (err, result) {
		if (err) {
			console.log(err);
			res.redirect('/');
		}
		else {
			console.log(result);
			res.redirect('/');
		}
	});
	// res.redirect('/login');
}


//Adding User
function register(req, res, next) {
	res.render('register', {
		page: 'register', auth: false, title: 'Owner Sign Up',
		messages: {
			danger: req.flash('danger'),
			warning: req.flash('warning'), success: req.flash('success')
		}
	});
	console.log(req.flash('warning'));
}

function reg_user(req, res, next) {
	// console.log(auth);
	var sql_query = 'INSERT INTO users VALUES';
	var id = req.body.emailid;
	var name = req.body.Name;
	var password = req.body.password;
	var check_query = `SELECT userid FROM users WHERE userid='${id}'`;
	console.log(check_query);
	var pwd = bcrypt.hashSync(req.body.password, salt);
	console.log(pwd);
	var insert_query = sql_query + "('" + id + "','" + name + "','" + pwd + "')";
	pool.query(check_query, function (err, result) {
		// console.log(result.rows);
		if (result.rows[0]) {
			req.flash('warning', "This email address is already registered.");
			// console.log("yoyoyooyooyyooyoyoyoy");
			res.redirect('/register');
		}
		else {
			pool.query(insert_query, function (err, result) {
				if (err) { console.log(err); }
				else {
					// client.query('COMMIT')
					console.log(result);
					req.flash('success', 'User created.');
					res.redirect('/login');
				}
			});
		}
	});
	// var sql_query = 'select * from users';
	// pool.query(sql_query, function(err,result){
	// 	if(err)
	// 		console.log(err);
	// 	else{
	// 		console.log(result);
	// 		res.redirect('/');
	// 		return;
	// 	}
	// });
}




function getlogin(req, res, next) {
	res.render('login', {
		page: 'login', auth: false, title: 'Login',
		messages: {
			danger: req.flash('danger'),
			warning: req.flash('warning'), success: req.flash('success')
		}
	});
}


function setsession(req,res,next){
	console.log(req.user);
	ssn=req.session;
	var stat = 'none';
	var query1="BEGIN; select 1 from owner where ownerId = '"+req.user.username+"';";
	var query2 = "select 1 from caretaker where caretakerId = '"+req.user.username+"'; END;";
	console.log(query1+query2);
	console.log("we weree on a break");
	pool.query(query1+query2,function(err, result){
		console.log(result);
		if(err)
			console.log(err);
		else{
			if(result[1].rows.length===1)
			{
				stat = 'owner';
			}
			if(result[2].rows.length === 1)
			{
				if( stat ==='owner')
					stat = 'both';
				else
					stat = 'caretaker';
			}
			ssn.status = stat;
			console.log(ssn.status);
			res.redirect('/'); 
		}
	});

	
}

/** CARETAKER FUNCTIONALITY
 * 1. LISTS OUT ALL CARETAKERS 
 * 2. ACQUIRE ALL CARETAKERS ON A GIVEN DAY
 * 3. POST A BID FOR A CARETAKER
 **/

function getcare(req, res, next) {
	if (!(req.session.status == 'owner' || req.session.status == 'both')) {
		res.redirect('/');
		return;
	}
	var tbl = [];
	var query = 'SELECT * FROM caretaker';
	pool.query(query, (err, data) => {
		console.log(data)
		// tbl = data;
		// console.log(tbl);
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
		} else {
			tbl = data.rows;
		}
		res.render('carelist', { page: '', title: 'CareList', base: true, tbl:tbl});
	});
}

function findcare (req, res, next) {
	var body = req.body;
	var date = body.day;
	var tbl = [];
	var base;
	var query = 'SELECT C.caretakerid from C cares where C.selected_date =' + date + '';

	console.log(query);

	pool.query(query, (err, data) => {
		console.log(data)
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
			base = false;
		} else {
			tbl = data.rows;
			base = true;
		}
		res.render('carelist', { page: '', title: 'CareList', base: base, tbl: tbl });
	});
	
	console.log(dateValue);

	// var list_query = "SELECT caretakerId, serviceId, selectedDate FROM CARES where selectedDate" = 'dateValue';

}






function logout(req, res, next) {
	req.session.destroy();
	req.logout();
	res.redirect('/');
}

function getbid(req,res){
	if (req.session.status === 'caretaker' || req.session.status === 'none')
	{
		res.redirect('/');
	}
	else
	{
		res.render('bid',{
			page : 'bid',
			title: 'Bidding'
		});
	}
}

function postbid(req,res){
	if (req.session.status === 'caretaker' || req.session.status === 'none')
	{
		res.redirect('/');
	}
	else
	{
		console.log(req.body);
		console
	}
}

module.exports = initRouter;


