require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: function(req, res, next) {
    //Auth header value = > send token into header
  
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
  
        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];
  
        //set the token
        // req.token = bearerToken;
  
        jwt.verify(bearerToken, process.env.SECRET, function(err, decoded) {
          if (err) return res.status(401).send({ auth: false, message: 'Falha ao autenticar o token.' });
          
          //res.status(200).send(decoded);
          next();
        });
  
        //next middleweare
  
    }else{
        //Fobidden
        res.sendStatus(403);
    }
  }
};