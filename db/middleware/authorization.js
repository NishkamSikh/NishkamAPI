const jwt = require('jsonwebtoken');
require('dotenv').config(); 

module.exports = function (req, res, next) {
    try {
        const ret = req.header('Authorization');
        // console.log(jwtToken);
        var jwtToken = ret.replace('Bearer ','');
        // console.log(jwtToken);   //prints: 123

        // If no token returned, decline authorization
        if(!jwtToken) {

            return res.status(403).json('Not authorized jwt');
        }

        // verify token, get user id
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);

        req.user = payload.user;

        next();

        
    } catch (err) {
        return res.status(403).json('Not authorized');   
    }
};