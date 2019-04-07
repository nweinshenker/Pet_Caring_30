// const sql_query = require('../sql');

const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const authMiddleware = require('./middleware');
const antiMiddleware = require('./antimiddle');

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

function findUser (username, callback) {
  var check_query = 'SELECT userid, name, password FROM users WHERE userid=' + "'"+username+"'";
	pool.query(check_query, (err, data) => {
		if(err) {
			console.error("Cannot find user");
			return callback(null);
		}
		
		if(data.rows.length == 0) {
			console.error("User does not exists?");
			return callback(null)
		} else if(data.rows.length == 1) {
			return callback(null, {
				username    : data.rows[0].username,
				passwordHash: data.rows[0].password,
				firstname   : data.rows[0].name,
				// lastname    : data.rows[0].last_name,
				// status      : data.rows[0].status
			});
		} else {
			console.error("More than one user?");
			return callback(null);
		}
	});
}

// passport.serializeUser(function (user, cb) {
//   cb(null, user.username);
// })

// passport.deserializeUser(function (username, cb) {
//   findUser(username, cb);
// })
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function initPassport () {
  passport.use(new LocalStrategy(
    (username, password, done) => {
      findUser(username, (err, user) => {
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          console.error('User not found');
          return done(null, false);
        }

        // Always use hashed passwords and fixed time comparison
        bcrypt.compare(password, user.passwordHash, (err, isValid) => {
          if (err) {
            return done(err);
          }
          if (!isValid) {
            return done(null, false);
          }
          return done(null, user);
        })
      })
    }
  ));

  passport.authMiddleware = authMiddleware;
  passport.antiMiddleware = antiMiddleware;
	passport.findUser = findUser;
}

module.exports = initPassport;