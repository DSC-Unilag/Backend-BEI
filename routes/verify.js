const jwt = require('jsonwebtoken');
var config = require('../config');


const verifyToken = (req, res, next) => {
    var token =  req.body.token || req.query.token || req.headers['x-access-token'];
    //checks for token
    if(!token) {
        return res.status(403).send({auth: false, message:'No token provided.'})
    }
    //verifies token
    jwt.verify(token, config.secretconfig.secret, (err, decoded) =>{
        if (err){
            return res.status(500).send({
                auth:false,
                 message:'failed to authenticate token'
                })
        }
        //if there are no errors, save to request for use in other routes
        console.log(decoded.id)
        req.userId = decoded.id;
        next();
    })
}

module.exports = verifyToken;