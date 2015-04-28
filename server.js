var express = require('express'),
    api     = require('./api'),
    users   = require('./accounts'),
    app     = express(),
    path 	= require('path');

app
    .use(express.static('./public'))
    .use(users)
    .use('/api', api)
    .get('*', function (req, res) {
    	if (!req.user) {
    		res.redirect('/login');
    	} else {
        	res.sendFile(path.join(__dirname, '/public', 'main.html'));
    	}
    })
    .listen(3000);
