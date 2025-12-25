const jwt = require('jsonwebtoken');
require('dotenv').config();
const express =require("express");
const app =express();

const cookieParser=require("cookie-parser");
app.use(cookieParser());
module.exports = function (req, res, next) {
    console.log(req.cookies.token);
  const token = req.cookies.token;
  

  
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};