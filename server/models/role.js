const con = require("./db");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////

//--------------------------------------------------------------------------------------------
//CHECK IF role EXISTS OR NOT - --
const checkrole = (req, res, next) => {
  console.log("---checkrole Middleware---");
  //console.log(req.params.id);
  const encryptedid = req.params.id;
  const idvalue = decodetheid(encryptedid);
  // console.log(idvalue);
  const checkNum = Number.isInteger(idvalue);
  //console.log(checkNum);
  if (checkNum == true) {
    //if id is integer
    con.query("SELECT id from role WHERE id=?", [idvalue], (err, response) => {
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
  checkrole,
};
