const con = require("./db");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//
//--------------------------------------------------------------------------------------------------
//checkLog EXISTS OR NOT - --
const checkLog = (req, res, next) => {
  console.log("---checkLog Middleware---");
  //console.log(req.params.id);
  const idvalue = Number(req.params.id);
  // console.log(idvalue);
  // console.log(typeof idvalue);
  const checkNum = Number.isInteger(idvalue);
  //console.log(checkNum);
  if (checkNum == true) {
    // console.log("NUMBER");
    //if id is integer
    con.query("SELECT id from logs WHERE id=?", [idvalue], (err, response) => {
      //console.log(response);
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
//
module.exports = {
  checkLog,
};
