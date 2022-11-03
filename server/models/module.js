const con = require("./db");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//--------------------------------------------------------------------------------------------
//CHECK IF module EXISTS OR NOT - --
const checkmodule = (req, res, next) => {
  console.log("---checkmodule Middleware---");
  //console.log(req.params.id);
  const idvalue = req.params.id;
  //console.log(idvalue);
  con.query("SELECT id from module WHERE id=?", [idvalue], (err, response) => {
    if (!err) {
      if (response && response.length > 0) {
        console.log("Middleware Passed");
        next();
      } else {
        console.log("Middleware Failure");
        console.log("No-record-LLLLLLLLLLLLLL");
        const Error = {
          status: "error",
          message: "No such record in Table",
        };
        res.status(204).json(Error);
      }
    }
  });
};
//--------------------------------------------------------------------------------------------
module.exports = {
  checkmodule,
};
