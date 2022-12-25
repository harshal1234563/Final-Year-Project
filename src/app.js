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
//!==========================================================================================================================




var userInfo = "";
var usrLocation ="" ;
var usrCity = "";





// *=======================================================================
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
        userInfo = email;

        res.writeHead(301, { Location: "/" }, { login: true });
        res.end();
      } else {
        res.render("login", { login: true });
      }
    }
  });
});

//! setup main route.
app.get("/", (req, res) => {
  


  let qry = "select * from tiffin_provider ORDER BY rating DESC LIMIT 0,4";
  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("index", { data: results });
    }
  });

  console.log(userInfo);

  
});

// =====================================================================
// !priority based recommendation
app.post("/test", (req, res) => {
  // console.log("route hit");

  
  if(req.session.loggedin){
      // ! === fetching user details ===
  let slctqry = "select * from user_details where email=?";

  mysql.query(slctqry, [userInfo], (err, results) => {
    if (err) throw err;
    else {
      console.log(results[0].name);
      usrLocation = results[0].location;
      usrCity = results[0].city;
    }
  });

  console.log(usrLocation);

  const priority = req.body.val;

  let qry;

  if (priority == "Price") {
    qry =
      "SELECT * FROM tiffin_provider WHERE cost_range=(SELECT MIN(cost_range) FROM tiffin_provider) AND city ='" +usrCity+"' AND rating >=4 ORDER BY pos_count DESC LIMIT 0,4;";
  } else if (priority == "Location") {
    qry =
      "SELECT * FROM tiffin_provider WHERE location = '" + usrLocation+ "'AND city= '" + usrCity+ "'AND rating =5 ORDER BY pos_count DESC LIMIT 0,4;";
  } else if (priority == "Taste") {
    qry =
      "SELECT * FROM tiffin_provider WHERE city='" + usrCity+ "'AND rating >= 4 ORDER BY taste_count DESC LIMIT 0,4;";
  } else {
    qry = "select * from tiffin_provider ORDER BY rating DESC LIMIT 0,4";
  }

  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.json([
        {
          output: results,
        },
      ]);
    }
  });
  }


  //   res.json([{
  //     req.body.val
  //  }])
  console.log(req.body.val);
});

//  =====================================================================
// ! Add User
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



app.get("/viewMess/:messId", function(req, res) {

  const requestedMesstId = req.params.messId;

  let qry= "select * from tiffin_provider where mess_id ='" + requestedMesstId+ "'";
  mysql.query(qry, (err, results) => {
    if (err) throw err;
    else {
      res.render("mess", { data: results });
    }
  });

  // res.send(requestedPostId)
});

app.get("/cart/mess/:messId/user/:userId", (req, res) => {

  const requestedMesstId = req.params.messId;
  const requestedUserId = req.params.userId;

  let messqry= "select * from tiffin_provider where mess_id ='" + requestedMesstId+ "'";
  let usrqry= "select * from user_details where user_id = '" + requestedUserId+ "'";

  mysql.query(messqry, (err, results) => {
    if (err) throw err;
    else {
      res.render("cart", { data: results });
    }
  });



  // res.send("mess id : " + requestedMesstId + " user id : " + requestedUserId);
});

// ====================================
// ! Cart Route
app.get("/cart", (req, res) => {
  if (req.session.loggedin) {
    // Output username
    res.render("cart");
  } else {
    // Not logged in
    res.send("Please login to view this page!");
  }
});
