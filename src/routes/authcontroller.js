const Model = require('../models/model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../helpers/config');
const Users = new Model('users');

//functions to handle routes
module.exports = {

	authRegister: (req, res) => {
		Users.find({ username: req.body.username }).then(result => {
			//if username is taken
			if (result.length) {
				res.status(401).json({ auth: false, message: "username already exist!" })
			}
			else	{
				//pass hashed password in callback
				bcrypt.hash(req.body.password, 8, (err, hashedPassword) => {
					if (err) {
						res.status(500).send(err);
					}
					const newUser = {
						name: req.body.name,
						username: req.body.username,
						password: hashedPassword
					}
					Users.insert(newUser).then(user => {
						//create token
						var token = jwt.sign({ id: user[0].id }, config.secretconfig.secret,
							{ expiresIn: 86400 }); //token expires in 24hours
						res.status(200).send({ auth: true, token: token });
					}).catch(() => {
						res.status(500).send("there was a problem registering the user");
					});
				});
			}

		});

	},

	authLogin: (req, res) => {
		//find user by username
		Users.find({ username: req.body.username }).then(user => {
				//if no user
			if (user.length == 0) {
				res.status(404).send({message:'User not found'});
			}
			else	{
					//compare passwords synchronously
				var isMatch = bcrypt.compareSync(req.body.password, user[0].password);
				if (isMatch) {
					var token = jwt.sign({ id: user[0].id },
						config.secretconfig.secret,
						{ expiresIn: 86400 });//expires in 24hours
						res.status(200).send({ auth: true, token: token });
				}
				else {
					res.status(401).send({ auth: false, token: null });
				}
			}
		}).catch((error) => {
			res.send({message:"error occured while registering user"})
			console.log(`error - ${error.message}`);
		});
	},

	testToken: (req, res, next) => {
		Users.findOne(['id', 'name', 'username'], { id: req.userId }).then(result => {
			res.status(200).json(result[0]);
		}).catch(error => {
			res.status(500).json(error.message);
		});
	}
}