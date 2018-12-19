'use strict';

var Model = require('../models/model');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config');
var Users = new Model('users');

//functions to handle routes
module.exports = {

	authRegister: function authRegister(req, res) {
		Users.find({ username: req.body.username }).then(function (result) {
			//if username is taken
			if (result.length) {
				res.status(401).json({ auth: false, message: "username already exist!" });
			}
			//pass hashed password in callback
			bcrypt.hash(req.body.password, 8, function (err, hashedPassword) {
				if (err) {
					res.status(500).send(err);
				}
				var newUser = {
					name: req.body.name,
					username: req.body.username,
					password: hashedPassword
				};
				Users.insert(newUser).then(function (user) {
					//create token
					var token = jwt.sign({ id: user[0].id }, config.secretconfig.secret, { expiresIn: 86400 }); //token expires in 24hours
					res.status(200).send({ auth: true, token: token });
				}).catch(function () {
					res.status(500).send("there was a problem registering the user");
				});
			});
		});
	},

	authLogin: function authLogin(req, res) {
		//find user by username
		Users.find({ username: req.body.username }).then(function (user) {
			//if no user
			if (user.length == 0) {
				res.status(404).send('User not found');
			}
			//compare passwords synchronously
			var isMatch = bcrypt.compareSync(req.body.password, user[0].password);
			if (isMatch) {
				var token = jwt.sign({ id: user[0].id }, config.secretconfig.secret, { expiresIn: 86400 }); //expires in 24hours
				res.status(200).send({ auth: true, token: token });
			} else {
				res.status(401).send({ auth: false, token: null });
			}
		}).catch(function (err) {
			res.status(500).send('An internal error occured, sorry!');
			console.log(err);
		});
	},

	testToken: function testToken(req, res, next) {
		Users.findOne(['id', 'name', 'username'], { id: req.userId }).then(function (result) {
			res.status(200).json(result[0]);
		}).catch(function (error) {
			res.status(500).json(error.message);
		});
	}
};