const express = require('express');
const secret = process.env.SECRET;
const jwt = require('jsonwebtoken');
// middlewares.js


// Example middleware to log request details
const userMiddleware = (req, res, next) => {
    let bearerToken = req.headers.authorization;
    if(!bearerToken)
    {
        console.log('No token found');
        return res.status(401).json({response: 'Unauthorized'});
    }
    let token = bearerToken.split(' ')[1];
    if(!token || token === '' || token === 'null' || token === 'undefined')
    {
        console.log('No token found');
        return res.status(401).json({response: 'Unauthorized'});
    }
    let decoded = jwt.verify(token, secret);
    if(decoded)
    {
        console.log(decoded.email);
        req.email = decoded.email;
        console.log();
        next();
    }
    else
    {
        res.status(401).json({response: 'Unauthorized'});
    }
};


module.exports = {
    userMiddleware: userMiddleware
};