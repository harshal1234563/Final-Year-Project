const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require("./config").con


require('dotenv').config();
const app = express();

// *setting middleware between frontend and server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/static',express.static('public'));

// setting up midlware for frontend
app.set('view engine', 'hbs');
app.engine('hbs', exphbs.engine( { 
  extname: '.hbs', 
  defaultLayout: 'main'
} ) );


// setup main route.
const mainRoutes = require("./router/main");
app.use('/', mainRoutes);









const port = process.env.PORT || 5000;
app.listen(port, ()=>  console.log(`Server started on port ${port}`));