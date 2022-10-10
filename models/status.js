const con = require("./db");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//
//CHECK IF Status EXISTS OR NOT - --
const checkStatus = (req, res, next) => {
  console.log("---checkStatus Middleware---");
  //console.log(req.params.id);
  const encryptedid = req.params.id;
  const idvalue = decodetheid(encryptedid);
  // console.log(idvalue);
  const checkNum = Number.isInteger(idvalue);
  //console.log(checkNum);
  if (checkNum == true) {
    //if id is integer
    con.query(
      "SELECT id from status WHERE id=?",
      [idvalue],
      (err, response) => {
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
      }
    );
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
//checkStatusAlready -- pending
//-------------------------------------------------------------------- - --
const checkStatusAlready = (req, res, next) => {
  console.log("---checkStatusAlready Middleware---");
  //
  const data = req.body;
  // console.log(data);
  //
  //---------------------------------------------------------------
  var gotofunctionality = 0;
  //check if creating new users_role or updating users_role
  if (req.params.id && req.params.id.length > 0) {
    console.log("Update Functionality");
    //
    var where;
    if (
      data.hasOwnProperty("store_type") &&
      filteredData.store_type > 0 &&
      filteredData.hasOwnProperty("module_id") &&
      filteredData.module_id > 0 &&
      filteredData.hasOwnProperty("store_id") &&
      filteredData.store_id > 0 &&
      filteredData.hasOwnProperty("status_type") &&
      filteredData.status_type > 0 &&
      filteredData.hasOwnProperty("title") &&
      filteredData.title.length > 0
    ) {
      gotofunctionality = 1;
    } else if (
      data.hasOwnProperty("store_type") &&
      filteredData.store_type > 0 &&
      filteredData.hasOwnProperty("module_id") &&
      filteredData.module_id > 0 &&
      filteredData.hasOwnProperty("store_id") &&
      filteredData.store_id > 0 &&
      filteredData.hasOwnProperty("status_type") &&
      filteredData.status_type > 0 &&
      filteredData.hasOwnProperty("title") &&
      filteredData.title.length > 0
    ) {
      gotofunctionality = 1;
    } else {
      console.log("Invalid Details Middleware");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
    //
  } else {
    console.log("Create Functionality");
    gotofunctionality = 1;
  }
  //---------------------------------------------------------------
  if (gotofunctionality == 1) {
    const userID = filteredData.users_id;
    // console.log(userID);
    const storetypeID = filteredData.store_type;
    // console.log(storetypeID);
    const roleID = filteredData.role;
    // console.log(roleID);
    const storeID = filteredData.store_id;
    // console.log(storeID);

    if (
      userID &&
      userID > 0 &&
      storetypeID &&
      storetypeID > 0 &&
      roleID &&
      roleID > 0 &&
      storeID &&
      storeID > 0
    ) {
      console.log("Valid Details Middleware");
      //-------------------------1----------------------------
      con.query(
        "SELECT id from users_role WHERE users_id=? AND store_type=? AND role=? AND store_id=? AND trash = 0",
        [userID, storetypeID, roleID, storeID],
        (err, response) => {
          if (!err) {
            if (response && response.length > 0) {
              // console.log(response);
              console.log("Users Role Already Exists");
              const Error = {
                status: "error",
                message: "Users Role Already Exists",
              };
              res.status(400).json(Error);
            } else {
              console.log("No-record-Middleware");
              next();
            }
          } else {
            console.log("Middleware Error");
            console.log(err);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
        }
      );
      //-------------------------1----------------------------
    } else if (
      userID &&
      userID > 0 &&
      storetypeID &&
      storetypeID > 0 &&
      roleID &&
      roleID > 0
    ) {
      console.log("Valid Details Middleware");
      //-------------------------1----------------------------
      con.query(
        "SELECT id from users_role WHERE users_id=? AND store_type=? AND role=? AND trash = 0",
        [userID, storetypeID, roleID],
        (err, response) => {
          if (!err) {
            if (response && response.length > 0) {
              // console.log(response);
              console.log("Users Role Already Exists");
              const Error = {
                status: "error",
                message: "Users Role Already Exists",
              };
              res.status(400).json(Error);
            } else {
              console.log("No-record-Middleware");
              next();
            }
          } else {
            console.log("Middleware Error");
            console.log(err);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
        }
      );
      //-------------------------1----------------------------
    } else {
      console.log("Invalid Details Middleware");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
    //
  }
};
//--------------------------------------------------------------------------------------------
//
module.exports = {
  checkStatus,
  checkStatusAlready,
};
