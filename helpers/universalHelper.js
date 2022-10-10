const con = require("../models/db");
//CHECK DB EMPTY------------------------------------------------------------------------------------
const dbempty = (value) => {
  const tablename = value;
  console.log(tablename);
  (req, res, next) => {
    con.query("SELECT * from " + tablename, (err, response) => {
      if (!err) {
        if (response && response.length) {
          next();
        } else {
          const Response = {
            status: "error",
            message: "No record in TABLE",
          };
          res.status(200).json(Response); //204STATUS
        }
      }
    });
  };
};
//--------------------------------------------------------------------------------------------------
module.exports = dbempty;
