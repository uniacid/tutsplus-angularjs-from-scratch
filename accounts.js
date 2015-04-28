var express = require('express'),
	bodyParser = require('body-parser'),
	session	   = require('express-session'),
	Bourne     = require('bourne'),
	crypto     = require('crypto'),
	path       = require('path');

var router = express.Router(),
	db = new Bourne('users.json');

function hash (password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(session({
		secret: 'magic cat',
		resave: false,
		saveUninitialized: true
	}))
	.get('/login', function (req, res) {
		res.sendFile(path.join(__dirname, '/public', 'login.html'));
	})
	.post('/login', function (req, res) {
		var user = {
			username: req.body.username,
			password: hash(req.body.password)
		};
		db.findOne(user, function(err, data) {
			if (data) {
				req.session.userId = data.id;
				res.redirect('/');
			} else {
				res.redirect('/login');
			}
		});
	})
	.post('/register', function (req, res) {
		var user = {
			username: req.body.username,
			password: hash(req.body.password),
			options: {}
		};

		db.find({ username: user.username }, function(err, data) {
			if (!data.length) {
				db.insert(user, function (err, data) {
					req.session.userId = data.id;
					req.redirect('/');
				});
			} else {
				res.redirect('/login');
			}
		});
	})
	.get('/logout', function (req, res) {
		req.session.userId = null;
		req.redirect('/');
	})
	.use(function (req, res, next) {
		if (req.session.userId) {
			db.findOne({ id: req.session.userId }, function (err, data) {
				req.user = data;
			});
		}
		next();
	});

module.exports = router;
