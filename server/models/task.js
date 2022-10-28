const con = require("./db");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//
//--------------------------------------------------------------------------------------------------
//CHECK IF TASK EXISTS OR NOT - --
const checktask = (req, res, next) => {
  console.log("---checktask Middleware---");
  //console.log(req.params.id);
  const idvalue = Number(req.params.id);
  // console.log(idvalue);
  // console.log(typeof idvalue);
  const checkNum = Number.isInteger(idvalue);
  //console.log(checkNum);
  if (checkNum == true) {
    // console.log("NUMBER");
    //if id is integer
    con.query("SELECT id from task WHERE id=?", [idvalue], (err, response) => {
      console.log(response);
      if (!err) {
        if (response && response.length) {
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
  } else {
    console.log("Middleware Failure");
    console.log("Invalid Id");
    const Error = {
      status: "error",
      message: "Forbidden",
    };
    res.status(403).json(Error);
  }
};
//--------------------------------------------------------------------------------------------
module.exports = {
  checktask,
};
