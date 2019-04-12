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
	app.get('/testing',passport.authMiddleware(),testing);


	app.get('/becomeOwner', passport.authMiddleware(), becomeOwner);
	app.get('/getpet', passport.authMiddleware(), getpet);
	app.get('/owner', passport.authMiddleware(), ownerprofile);
	app.get('/getreview', passport.authMiddleware(), getreview);
	app.post('/postreview', passport.authMiddleware(), postreview);
	app.get('/seecaretaker', passport.authMiddleware(), seecaretaker);
	// app.get('/findsitter',passport.authMiddleware(), getsitter);
	// app.get('/findsitter',passport.authMiddleware(), getsitter);
	/* List all CareTakers in a Table */
	app.get('/caretaker', passport.authMiddleware(), caretakerprofile);
	app.get('/becomeCaretaker', passport.authMiddleware(), becomeCaretaker);
	app.get('/getlist', passport.authMiddleware(), getlist);
	app.post('/updatelist',passport.authMiddleware(),updatelist);
	app.get('/ct/service',passport.authMiddleware(), addservice);

	/* Nathan's function's lol */
	app.get('/getcare', passport.authMiddleware(), getcare);
	app.post('/findcare', passport.authMiddleware(), findcare);
	app.get('/findcatservices', passport.authMiddleware(),findcatservices);
	app.get('/finddogservices', passport.authMiddleware(),finddogservices);
	app.get('/getbid', passport.authMiddleware(), getbid);
	app.post('/postbid', passport.authMiddleware(), postbid);
	app.get('/deletepet', passport.authMiddleware(), renderdelete);
	app.post('/postdelete', passport.authMiddleware(), postdelete);

	app.post('/postlist', passport.authMiddleware(), postlist);
	app.post('/postpet', passport.authMiddleware(), postpet);
	app.post('/ct/postservice', passport.authMiddleware(), postservice);

	/* LOGIN */
	app.post('/login', passport.authenticate('local', {
		successRedirect: '/setsession',
		failureRedirect: '/login'
	}));
	app.post('/reg_user', passport.antiMiddleware(), reg_user);
	/* LOGOUT */
	app.get('/logout', passport.authMiddleware(), logout);
}


////res.session.status variable defined 
//// value : none / caretaker / owmner / both

///home
function index(req, res) {
	console.log(req.session.status);
	res.render('index', { title: 'Express' });
}

function addservice(req,res){
	if (!(req.session.status == 'caretaker' || req.session.status == 'both' ))
	{	
		res.redirect('/');
	}
	else
	{
		find_all_services = "SELECT * from services S1 where S1.serviceId not in (select distinct P.serviceID from caretaker C natural join provides P where C.caretakerId ='"+req.user.username+"')";
		pool.query(find_all_services, function(err,result){
			if(err)
			{
				console.log(err);
				req.flash("error", "didn't selected a service");
				res.redirect('/ct/service');
			}
			else
			{
				res.render('addservice',{ page: 'addservice', title: 'Add Service', services: result.rows, xxx: req.flash()});
			}
		});
	}
}


function postservice(req,res){
	if (!(req.session.status === 'caretaker' || req.session.status === 'both' ))
	{	
		res.redirect('/');
	}
	else
	{
		console.log(req.body);
		var len = req.body.length;
		var add_provides ="BEGIN;";
		for( var i =0; i<len;i++)
		{
			// var ch = toString(i);
			// console.log(ch +" :: after ch :: " + req.body[i] );
			if(i in req.body)
			{
				add_provides += "INSERT into provides values ('"+req.user.username+"','"+req.body[i]+"');";
			}
		}
		add_provides+="END;";
		console.log(add_provides);
		pool.query(add_provides, function(err,result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
			}
			else
			{
				console.log(result);
				res.redirect('/caretaker');
			}
		});

	}
}

/////Adding availability in table list
function getlist(req,res){
	// console.log(req.session.status);
	if (!(req.session.status === 'caretaker' || req.session.status === 'both' ))
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
			}
			else
			{
				res.render('list', { page: 'list', title: 'Add Availability', services: result.rows, xxx: req.flash()});
			}
		});
		// console.log(provided_services);
		// console.log(":::::"+provided_services[1].name);
	}
}

function updatelist(req,res){
	if (!(req.session.status === 'caretaker' || req.session.status === 'both' ))
	{
		res.redirect('/');
	}
	else
	{
		console.log('hehehehehehehe');
		let query_serviceid=`SELECT serviceId from services S where S.name='${req.body.service}';`;
		console.log(query_serviceid);
		pool.query(query_serviceid, function(err,result){
			if(err){
				console.log('error in query_serviceid');
				console.log(err);
				res.redirect('/caretaker');
			}
			else{
				console.log('heylo');
				console.log(result.rows[0].serviceid);
				let update_query=`UPDATE list set basePrice=${req.body.baseprice}, available_dates=to_date('${req.body.datepicker}','YYYY MM DD'), serviceId= '${result.rows[0].serviceid}' where listId='${req.body.listid}';`;
				console.log(update_query);
				pool.query(update_query, function (err1,result1) {
					if(err1){
						console.log(err1);
						res.redirect('/caretaker');
					}
					else{
						if(result1.rowCount ===0){
							console.log('Inavlid');
						}
						else{
							console.log('Valid');
						}
						console.log(result1);
						res.redirect('/caretaker');
					}
				});
			}
		});
	}
}

function postlist(req, res) {
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
				req.flash("error", "overfload on size of input");
				res.redirect('/getlist');
			}
			else {
				console.log(result);
				res.redirect('/caretaker');
			}
		});
	}
	// res.redirect('/');
}


function ownerprofile(req, res) {
	// console.log("inside get pettttt" + req.session.status);
	if (!(req.session.status === 'owner' || req.session.status === 'both' ))
	{	
		console.log('not a owner yet');
		res.redirect('/becomeOwner');
	}
	else
	{
		var curr = new Date();
		var search_pet = "BEGIN;";
		var currdate = new Date();
		var todate=new Date(currdate).getDate();
		var tomonth=new Date(currdate).getMonth()+1;
		var toyear=new Date(currdate).getFullYear();
		var original_date=tomonth+'/'+todate+'/'+toyear;
		search_pet += "Select * from petowned P natural join cat C where P.ownerId = '"+req.user.username+"';";
		search_pet += "Select * from petowned P natural join dog D where P.ownerId = '"+req.user.username+"';";
		search_pet += "Select U.name as Uname, S.name as Sname, CA.listId as lid, CA.price as price, CA.selected_date as date from (cares CA natural join services S) inner join users U on U.userId  = CA.caretakerId where CA.ownerId ='"+req.user.username+"' and selected_date > to_date('"+original_date+"','MM DD YYYY');";
		search_pet += "Select U.name as Uname, S.name as Sname, CA.listId as lid, CA.price as price, CA.selected_date as date from (cares CA natural join services S) inner join users U on U.userId  = CA.caretakerId where CA.ownerId ='"+req.user.username+"' and selected_date <= to_date('"+original_date+"','MM DD YYYY');";
		// search_pet += "Select U.name as Uname, S.name as Sname, CA.listId as lid, CA.price as price , CA.selected_date as date from (cares CA natural join services S) inner join users U on U.userId  = CA.caretakerId where CA.ownerId ='"+req.user.username+"' and selected_date <= to_date('4/18/2019','MM DD YYYY');";
		search_pet +=`with listmax as (select max(B.price) as maxprice,L.available_dates as d,
		L.listid as listid,L.caretakerid as caretakerid, L.serviceId as serviceId from bid B left outer join list L on B.listid = L.listid group by L.listid),
  ownermax as
 (select max(B.price) as myprice,B.ownerId as ownerId, B.listId as listid
  from bid B left outer join list L on B.listid = L.listid group by B.ownerId,B.listid),
 withoutnames as
(select * from ownermax O left outer join listmax L using (listid) where O.myprice < L.maxprice)
select W.listid, W.myprice, W.maxprice, U.name as uname, S.name as sname, W.d as d from (withoutnames W natural join services S) inner join users U on U.userid = W.caretakerid 
where W.ownerId =  '`+req.user.username+`';`;
		search_pet += "END;"
		console.log("search_pet::::::::::::::::::"+search_pet);
		pool.query(search_pet , function (err, result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
			}
			else
			{
				var dogs = result[2].rows;
				var cats = result[1].rows;
				var past = result[4].rows;
				var lost = result[5].rows;
				console.log(dogs);
				console.log(past);
				console.log(cats);
				console.log(result[3].rows);
				// console.log(cats[0].petnum);
				res.render('ownerprofile', { page: 'ownerprofile' , title: 'Owner', cats: result[1].rows, dogs: result[2].rows , futures: result[3].rows, pasts: past, losing : lost});
			}
		});
	}
}



function caretakerprofile(req,res){
	if (!(req.session.status === 'caretaker' || req.session.status === 'both' ))
	{	
		console.log('not a caretaker yet');
		res.redirect('/becomeCaretaker');
	}
	else
	{
		var search_list = "BEGIN; Select * from list L natural join services S where L.caretakerId = '"+req.user.username+"';";
		search_list += "Select * from provides P natural join services S where P.caretakerId ='"+req.user.username+"';";
		search_list += "END;";
		console.log("search_pet::::::::::::::::::"+search_list);
		pool.query(search_list , function (err, result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
			}
			else
			{
				var s = result[2].rows;
				var l = result[1].rows;
				console.log(l);
				console.log(s);
				// var date=result[1].rows[0].available_dates;
				// var todate=new Date(date).getDate();s
			 //    var tomonth=new Date(date).getMonth()+1;
			 //    var toyear=new Date(date).getFullYear();
			 //    var original_date=tomonth+'/'+todate+'/'+toyear;
				// console.log(date.toDateString());
				// console.log(original_date);
				// to_date('$(original_date)','MM DD YYYY')
				// console.log(result[1].rows);
				
				// console.log(search_list+":::::::"+l+"::::::"+s);
				// console.log(result[1]);
				res.render('caretakerprofile', { page: 'caretakerprofile' , title: 'Caretaker', lists : l, skills : s});
			}
		});
	}

}


function getpet(req, res) {
	// console.log("inside get pettttt" + req.session.status);
	if (!(req.session.status === 'owner' || req.session.status === 'both' ))
	{	
		res.redirect('/');
	}
	else
		res.render('addpet', { page: 'addpet', title: 'Add Pet', xxx: req.flash()});
}

function postpet(req, res) {
	
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
		{
			console.log(err);
			req.flash('error', "Unsuccesful register of pet");
			res.redirect('/getpet');
		}
		else {
			console.log(result);
			res.redirect('/owner');
		}
	});
	}
}



//Adding to caretaker or owner table
function becomeOwner(req, res) {


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
		}
		else {
			console.log(result);
			res.redirect('/setsession');
		}
	});
	// res.redirect('/login');
}

function becomeCaretaker(req, res) {
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
			res.redirect('/setsession');
		}
	});
	// res.redirect('/login');
}


//Adding User
function register(req, res) {
	res.render('register', {
		page: 'register', auth: false, title: 'Owner Sign Up', error: req.flash('error'),
		messages: {
			danger: req.flash('danger'),
			warning: req.flash('warning'), success: req.flash('success')
		}
	});
	console.log(req.flash('warning'));
}

function reg_user(req, res) {
	// console.log(auth);
	var sql_query = 'INSERT INTO users VALUES';
	var id = req.body.emailid;
	var name = req.body.Name;
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
				if (err) { 
					console.log(err); 
					req.flash(err, 'User was not created.');
					res.redirect('/register');
				}
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


function getlogin(req, res) {
	res.render('login', {
		page: 'login', auth: false, title: 'Login',
		messages: {
			danger: req.flash('danger'),
			warning: req.flash('warning'), success: req.flash('success')
		}
	});
}


function setsession(req,res){
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

function getcare(req, res) {
	if (!(req.session.status === 'owner' || req.session.status === 'both')) {
		res.redirect('/');
		return;
	}
	var tbl = [];
	var curr = new Date();
	var currdate = new Date();
	var todate=new Date(currdate).getDate();
	var tomonth=new Date(currdate).getMonth()+1;
	var toyear=new Date(currdate).getFullYear();
	var original_date=tomonth+'/'+todate+'/'+toyear;
	var query = "Select U.name as name, L.caretakerId , L.listId , L.available_dates, L.baseprice , S.name as sname,C.price as max  from ((list L natural join services S) inner join Users U on U.userId = L.caretakerId) left outer join cares C on L.listid = C.listid where L.available_dates > to_date('"+original_date+"','MM DD YYYY') and L.caretakerId <> '"+req.user.username+"'  order by L.available_dates;"
	// var query = "Select U.name as name, L.caretakerId , L.listId , L.available_dates, L.baseprice , S.name as sname  from ((list L natural join services S) inner join Users U on U.userId = L.caretakerId) left outer join cares C on L.listid = C.listid where L.available_dates > to_date('"+original_date+"','MM DD YYYY') order by L.available_dates;";
	// var query = 'SELECT L.caretakerid, C.review, L.baseprice, C.selected_date, L.listId from (list L natural join cares C)';
	// query += `Select * from cares; END;`
	console.log(query);
	pool.query(query, (err, data) => {
		console.log(data);
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
			fromcares=[];
			req.flash('error', "wrong dates");
			res.redirect('/getcare');
		} else {
			tbl = data.rows;
			// fromcares = data[2].rows;
		}
		console.log(tbl);
		// console.log(fromcares);
		console.log('rendering');
		// if ('error' in req.flash()){
		// 	console.log(req.flash());
		// }

		res.render('carelist', { page: '', title: 'CareList', base: true, tbl: tbl, xxx: req.flash() });
	});
}

function findcare (req, res) {
	// console.log(req.body);
	var date2 = req.body.day;
	console.log(date2);
	console.log(req.body);
	var tbl = [];
	var base;
	var query =`Select U.name as name, L.caretakerId , L.listId , L.available_dates, L.baseprice , S.name as sname,C.price as max  from ((list L natural join services S) inner join Users U on U.userId = L.caretakerId) left outer join cares C on L.listid = C.listid where L.available_dates = to_date('${date2}','MM DD YYYY') and L.caretakerId <> '`+req.user.username+`' order by L.available_dates;`;
	// var query = `SELECT L.caretakerid, C.review,  C.selected_date, L.baseprice, L.listId from (list L natural join cares C) where C.selected_date = to_date('${date2}','MM DD YYYY');`;
	// query += `Select * from cares; END;`
	console.log(query);

	pool.query(query, (err, data) => {
		console.log(data);

		if (err || !data.rows || data.rows.length === 0) {
			tbl = [];
			fromcares = [];
			base = false;
			// req.flash('error', "Didn't find any correct dates");
			// res.redirect('/findcare');
		} else {
			tbl = data.rows;
			// fromcares = data[2].rows;
			base = true;
		}
		res.render('carelist', { page: '', title: 'CareList', base: base, tbl: tbl, xxx: req.flash() });
	});
	
	// console.log(dateValue);

	// var list_query = "SELECT caretakerId, serviceId, selectedDate FROM CARES where selectedDate" = 'dateValue';
}

/** CARETAKER FUNCTIONALITY
 * 1. DELETE PETS
 **/

function renderdelete(req, res) {
	// console.log("inside get pettttt" + req.session.status);
	if (!(req.session.status === 'owner' || req.session.status === 'both')) {
		res.redirect('/');
	}
	var search_pet = "BEGIN;";
	var pets = [];
	search_pet += "Select * from petowned P natural join cat C where P.ownerId = '" + req.user.username + "';";
	search_pet += "Select * from petowned P natural join dog D where P.ownerId = '" + req.user.username + "';";
	search_pet += "END;";
	console.log(search_pet);
	pool.query(search_pet, (err,data)=> {
		if (err) {
			console.log(err);
			res.redirect('/')
		}
		else {
			var cats = data[1].rows;
			console.log(cats);
			var dogs = data[2].rows;
			pets += cats;
			pets += dogs;
			res.render('deletepet', { page: 'deletepet', title: 'Delete Pet', cats:cats, dogs: dogs});
		}
	})
}

function postdelete(req, res) {
	if (!(req.session.status === 'owner' || req.session.status === 'both')) {
		res.redirect('/');
		return;
	}
	var pet_num = req.body.petnum;
	console.log(pet_num);
	var delete_pet = "Delete from petowned P where P.ownerId = '" + req.user.username + "' and P.petnum = '" + pet_num + "' ;"
	console.log(delete_pet);
	pool.query(delete_pet, (err, data) => {
		if (err) {
			console.log(err);
			res.redirect('/');
			return;
		}
		else {
			console.log(data);
			res.redirect('/owner');
			return;
		}
	});
}



function logout(req, res) {
	req.session.destroy();
	req.logout();
	res.redirect('/');
}

function getbid(req,res){
	if (req.session.status === 'caretaker' || req.session.status === 'none')
	{
		console.log('err');
		res.redirect('/');
	}
	else
	{
		console.log('in getbid');
		let find_pets = `SELECT name from petowned P where P.ownerId='${req.user.username}';`;
		pool.query(find_pets, function(err,result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
			}
			else
			{
				console.log(result.rows);
				req.flash('max',req.query.max);
				res.render('bid',{ page: 'bid', title: 'Bidding', pets: result.rows, listid: req.query.listid, max: req.query.max});
			}
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
		petname=req.body.petname;
		var query_petnum = `SELECT petnum from petowned where name='${petname}' and ownerId='${req.user.username}';`;
		pool.query(query_petnum, function (err,result) {
			if(err){
				console.log('err'+ err);
			}
			else{
				if(result.rows.length > 0) {
					var insert_query = `INSERT INTO bid VALUES('${req.user.username}','${req.body.listid}','${req.body.price}','${result.rows[0].petnum}')`;
					pool.query(insert_query, function (err, result) {
						if (err)
						{
							console.log(err);
							res.redirect('/getcare');
						}
						else {
							if(result.rowCount === 0){
								console.log();
								res.redirect('/');
							}
							else {
								res.redirect('/getcare');
							}
						}
					});
				}
				else{
					console.log('Invalid name');
					res.redirect('/getcare');
				}
			}
		});

	}
}


function getreview(req,res,next){

	if (!(req.session.status === 'owner' || req.session.status === 'both')) 
	{
		res.redirect('/');
	}
	else
	{
		// req.flash('listid', req.params.listid);
		console.log(req.query);
		res.render('getreview',{
			page : 'getreview',
			title: 'Add Review',
			listid: req.query.listid
		});
	}
}

function postreview(req,res,next){
	if (!(req.session.status == 'owner' || req.session.status == 'both')) {
		res.redirect('/');
		return;
	}
	else
	{
		console.log(req.body.content);
		console.log(req.body.listid);
		// var lid = req.flash('listid');
		var lid = req.body.listid;
		// console.log(req.flash('listid')); ///find a way to send it from front end
		var update_cares = "Update cares set review = '"+req.body.content+"' where listId = '"+lid+"'";
		console.log("update_cares::::::::::::::::::"+update_cares);
		pool.query(update_cares , function (err, result){
			if(err)
			{
				err = req.flash("warning", "didn't post review");
				console.log(err);
				res.redirect('/');
			}
			else
			{
				
				// console.log(cats[0].petnum);
				console.log(result);
				res.redirect('/owner'); //change to where list of ct's 
				return;
			}
		});
	}
}

function seecaretaker(req,res,next){
	if (!(req.session.status == 'owner' || req.session.status == 'both')) {
		res.redirect('/');
		return;
	}
	else
	{
		var caretakerId = req.query.ctid;
		seecaretaker_query = "BEGIN;";
		seecaretaker_query += "Select C.review, S.name as sname, U.name as uname from (cares C natural join services S) inner join users U on C.ownerId = U.userId where C.review is not null and C.caretakerId = '"+caretakerId+"';";
		seecaretaker_query += "END;";
		console.log(seecaretaker_query);
		pool.query( seecaretaker_query , function(err,result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
			}
			else
			{
				console.log(result[1].rows);
				res.render('seecaretaker',{ page  : 'seecaretaker', title : 'Caretaker', reviews : result[1].rows});
			}
		});
	}
}

function findcatservices(req,res,next){
	if (!(req.session.status === 'owner' || req.session.status === 'both')) {
		res.redirect('/');
		return;
	}
	var tbl = [];
	var curr = new Date();
	var currdate = new Date();
	var todate=new Date(currdate).getDate();
	var tomonth=new Date(currdate).getMonth()+1;
	var toyear=new Date(currdate).getFullYear();
	var original_date=tomonth+'/'+todate+'/'+toyear;
	var query = "Select U.name as name, L.caretakerId , L.listId , L.available_dates, L.baseprice , S.name as sname,C.price as max  from ((list L natural join (catservices CS natural join services S)) inner join Users U on U.userId = L.caretakerId) left outer join cares C on L.listid = C.listid where L.available_dates > to_date('"+original_date+"','MM DD YYYY') and L.caretakerId <> '"+req.user.username+"'  order by L.available_dates;"
	console.log(query);
	pool.query(query, (err, data) => {
		console.log(data);
		// console.log()
		// tbl = data;
		// console.log(tbl);
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
			fromcares=[];
		} else {
			tbl = data.rows;
			// fromcares = data[2].rows;
		}
		console.log(tbl);
		// console.log(fromcares);
		console.log('rendering');
		res.render('carelist', { page: '', title: 'CareList', base: true, tbl:tbl });
	});
}

function finddogservices(req,res,next){
	if (!(req.session.status === 'owner' || req.session.status === 'both')) {
		res.redirect('/');
		return;
	}
	var tbl = [];
	var curr = new Date();
	var currdate = new Date();
	var todate=new Date(currdate).getDate();
	var tomonth=new Date(currdate).getMonth()+1;
	var toyear=new Date(currdate).getFullYear();
	var original_date=tomonth+'/'+todate+'/'+toyear;
	var query = "Select U.name as name, L.caretakerId , L.listId , L.available_dates, L.baseprice , S.name as sname,C.price as max  from ((list L natural join (dogservices CS natural join services S)) inner join Users U on U.userId = L.caretakerId) left outer join cares C on L.listid = C.listid where L.available_dates > to_date('"+original_date+"','MM DD YYYY') and L.caretakerId <> '"+req.user.username+"'  order by L.available_dates;"
	console.log(query);
	pool.query(query, (err, data) => {
		console.log(data);
		// console.log()
		// tbl = data;
		// console.log(tbl);
		if (err || !data.rows || data.rows.length == 0) {
			tbl = [];
			fromcares=[];
		} else {
			tbl = data.rows;
			// fromcares = data[2].rows;
		}
		console.log(tbl);
		// console.log(fromcares);
		console.log('rendering');
		res.render('carelist', { page: '', title: 'CareList', base: true, tbl:tbl });
	});
}


function testing(req,res,next){
	var num  = 3;
	var content = "something";
	var d = new Date();
	console.log(d);
	var search_list = "Select convert(varchar(10),available_dates,103) from list L natural join services S where L.caretakerId = '"+req.user.username+"'";
	var update_cares = "Update cares set review = '"+content+"' where listId = '"+num+"'";
	var complex = `with listmax as
 (select max(B.price) as maxprice,L.available_dates as d,L.listid as listid,L.caretakerid as caretakerid, L.serviceId as serviceId
 from bid B left outer join list L on B.listid = L.listid group by L.listid),
  ownermax as
 (select max(B.price) as myprice,B.ownerId as ownerId, B.listId as listid
  from bid B left outer join list L on B.listid = L.listid group by B.ownerId,B.listid)
select * from ownermax O left outer join listmax L on O.listid = L.listid where O.myprice < L.maxprice`
	pool.query(complex , function (err, result){
			if(err)
			{
				console.log(err);
				res.redirect('/');
				return;
			}
			else
			{
				// var d = new Date();
				// console.log(d)
				// console.log(cats[0].petnum);
				console.log(result.rows);
				res.redirect('/');
				return;
			}
		});
}


module.exports = initRouter;


