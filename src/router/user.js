const express = require('express');
const route = require('express/lib/application');

const routes = express.Router();


routes.get('/login', (req, res)=>{

  res.render("login");
});


module.exports = routes;