var express = require('express'),
	bodyParser = require('body-parser'),
	session	   = require('express-session'),
	Bourne     = require('bourne'),
	crypto     = require('crypto');

var router = express.Router(),
	db = new Bourne('user.json');

function hash (password) {
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
	.use(bodyParser.urlencoded())
	.use(bodyParser.json())
	.use(session({ secret: 'dsafsadfsdaflsadfkdsja32432lfk23' }))
	.get('/login', function (req, res) {
		res.sendfile('public/login.html');
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
	.post('/create')
	.get('/logout')