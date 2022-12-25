const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("./config").con;
const session = require("express-session");

require("dotenv").config();
const app = express();

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// *setting middleware between frontend and server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/static", express.static("public"));

// setting up midlware for frontend
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));


//! setup main route.
app.get("/", (req, res) => {



  let qry = "select * from tiffin_provider ORDER BY rating DESC LIMIT 0,4";
  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("index", { data: results });
    }
  });



});

app.post('/test', (req, res)=>{
  console.log("route hit");

  const priority = req.body.val;

  let qry ;

  if(priority == "Price"){
    qry = "SELECT * FROM tiffin_provider WHERE cost_range=(SELECT MIN(cost_range) FROM tiffin_provider) AND city = 'wardha' AND rating >=4 ORDER BY pos_count DESC LIMIT 0,4;"
  }else if(priority == "Location"){
    qry = "SELECT * FROM tiffin_provider WHERE location = 'Dhantoli' AND city='Wardha' AND rating =5 ORDER BY pos_count DESC LIMIT 0,4;"
  }else{
    qry = "SELECT * FROM tiffin_provider WHERE city='Wardha' AND rating >= 4 ORDER BY taste_count DESC LIMIT 0,4;"
  }

  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.json([{
        output: results
      }])
    }
  });
//   res.json([{
//     req.body.val
//  }])
 console.log(req.body.val);



})

// !login routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/loginUser", (req, res) => {
  const { email, password } = req.query;

  let qry = "select * from user_details where email=? and password=?";

  mysql.query(qry, [email, password], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        req.session.loggedin = true;
        
console.log("test s");
        res.writeHead(301, { Location: "/" }, { login: true });
        res.end();
      } else {
        res.render("login", { login: true });
      }
    }
  });
});

app.get("/createAccount", (req, res) => {
  res.render("register");
});

app.get("/addUser", (req, res) => {
  const { name, email, phone, password, address, city, location, gender } =
    req.query;

  let qry = "select * from user_details where email=? OR phone=?";
  mysql.query(qry, [email, phone], (err, results) => {
    if (err) throw err;
    else {
      if (results.length > 0) {
        res.render("register", { checkmsg: true });
      } else {
        // insert query
        let qry2 = "insert into user_details values(?,?,?,?,?,?,?,?,?)";
        mysql.query(
          qry2,
          [, name, email, phone, password, address, city, location, gender],
          (err, results) => {
            if (err) throw err;
            else {
              if (results.affectedRows >= 0) {
                res.render("login");
              }
            }
          }
        );
      }
    }
  });
});

// Admin Routes
app.get("/register", (req, res) => {});
app.get("/viewDetails", (req, res) => {});

app.get("/cart", (req, res) => {
  if (req.session.loggedin) {
    // Output username
    res.render("cart");
  } else {
    // Not logged in
    res.send("Please login to view this page!");
  }
});
