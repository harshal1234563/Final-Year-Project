const mysql = require("../config").con; 


exports.view = (req, res)=>{
  let qry = "select * from tiffin_count ORDER BY rating DESC LIMIT 0,4;";
  mysql.query(qry, (err, results) => {
      if (err) throw err
      else {
          res.render("index", { data: results });
      }

    });
}
