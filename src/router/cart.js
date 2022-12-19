const express = require('express');
const route = require('express/lib/application');

const routes = express.Router();




routes.get('/cart', (req, res)=>{

  res.render("cart");
});


module.exports = routes;