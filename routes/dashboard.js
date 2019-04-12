var express = require('express');
var router = express.Router();

const { Pool } = require('pg')
const pool = new Pool({
    user: 'nathanweinshenker',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})


router.get('/', function (req, res, next) {
    res.render('dashboard', { title: 'User' });
});

module.exports = router;