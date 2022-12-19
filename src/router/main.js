const express = require('express');
const {route} = require('express/lib/application')
const userRoutes = require("./user");
const adminRoutes = require("./admin");
const cartRoute = require("./cart");
const homeCotroller = require("../controller/homeController")




const routes = express.Router();

routes.get('/', homeCotroller.view);


routes.get('/login', userRoutes);
routes.get('/cart', cartRoute);

module.exports = routes;