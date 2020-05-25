require('dotenv').config();
const express = require('express'),
	router = express.Router(),
	OAuth2Server = require('oauth2-server');
(Request = OAuth2Server.Request), (Response = OAuth2Server.Response);

router.oauth = new OAuth2Server({
	model: require('../modelRefreshToken/model.js'),
	accessTokenLifetime: 15,
	allowBearerTokensInQueryString: true
});

router.get('/', authenticateRequest, function(req, res) {
	res.send('Hemmelig data!!!');
	// res.send({'data':'Hemmelig data!!!'});
});

router.all('/token', obtainToken);

function obtainToken(req, res) {

	req.headers['content-type'] = 'application/x-www-form-urlencoded';
	
	let request = new Request(req);
	let response = new Response(res);

	return router.oauth
		.token(request, response)
		.then(function(token) {
			res.json(token);
		})
		.catch(function(err) {
			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {

	req.headers['content-type'] = 'application/x-www-form-urlencoded';

	var request = new Request(req);
	var response = new Response(res);

	return router.oauth
		.authenticate(request, response)
		.then(function(token) {
			next();
		})
		.catch(function(err) {
			res.status(err.code || 500).json(err);
		});
}

module.exports = router;
