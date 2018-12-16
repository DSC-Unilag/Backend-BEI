const Model = require('../models/model');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var config = require('../config');
const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));
const Users = new Model('users');

module.exports = {

    authregister: (req, res) => {
        bcrypt.hash(req.body.password, 8, (err, hashedPassword) => {
            if (err){
                res.status(500).send(err);
            }
            var newUser = {
                name:req.body.name,
                username:req.body.username,
                password:hashedPassword
            }
            Users.insert(newUser)
            .then(user => {
                //create token
                var token = jwt.sign({id : user.id},
                            config.secretconfig.secret,{
                                expiresIn:86400 //token expires in 24hours
                            });
                 res.status(200).send({auth: true, token: token});
            }).catch(() => {
                res.status(500).send("there was a problem registering the user");
            })
        })

    },
    authlogin:(req, res) => {
        //find user by username
        Users.find({username:req.body.username})
        .then(user => {
            //if no user
            if (user.length == 0){
              res.status(404).send('User not found');
            }
            //compare passwords synchronously
            var isMatch = bcrypt.compareSync(req.body.password, user[0].password);
                if (isMatch){
                var token = jwt.sign({id:user[0].id},
                        config.secretconfig.secret,
                        {expiresIn:86400});//expires in 24hours
                res.status(200).send({auth:true, token:token});
                }
                else{
                    res.status(401).send({auth:false, token:null});
                }
            }).catch((err) => {
            res.status(500).send('An internal error occured, sorry!');
            console.log(err)
        })


    },
    testtoken:(req, res, next) => {
        Users.findOne(['id','name','username'],{id:req.userId})
        .then(result => {
            console.log(result)
        }).catch(error => {
            console.log(error.message)
        })
    
    }

    



}