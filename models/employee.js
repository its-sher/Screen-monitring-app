const con = require("./db");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//
//--------------------------------------------------------------------------------------------------
//CHECK IF USERID EXISTS OR NOT - --
const checkemployee = (req, res, next) => {
  console.log("---checkemployee Middleware---");
  //console.log(req.params.id);
  const idvalue = Number(req.params.id);
  // console.log(idvalue);
  // console.log(typeof idvalue);
  const checkNum = Number.isInteger(idvalue);
  //console.log(checkNum);
  if (checkNum == true) {
    // console.log("NUMBER");
    //if id is integer
    con.query(
      "SELECT id from employees WHERE id=?",
      [idvalue],
      (err, response) => {
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
//checkemployeealready -------------------------------------------------------------------- - --
const checkemployeealready = (req, res, next) => {
  console.log("---checkemployeealready Middleware---");
  //
  const data = req.body;
  // console.log(data);
  let filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v != "null" && v != "" && v != null && v != null
    )
  );
  // console.log(filteredData);
  //
  //
  //---------------------------------------------------------------
  var gotofunctionality = 0;
  //check if creating new employee or updating
  if (req.params.id && req.params.id.length > 0) {
    console.log("Update Functionality");
    //
    if (
      filteredData.hasOwnProperty("phone") &&
      filteredData.phone.toString().length > 0 &&
      filteredData.hasOwnProperty("email") &&
      filteredData.email.length > 0
    ) {
      //
      gotofunctionality = 1;
      //
    } else if (
      filteredData.hasOwnProperty("phone") &&
      filteredData.phone.toString().length > 0
    ) {
      //
      gotofunctionality = 2;
      //
    } else if (
      filteredData.hasOwnProperty("email") &&
      filteredData.email.length > 0
    ) {
      //
      gotofunctionality = 3;
      //
    } else {
      console.log("No check in middleware needed");
      next();
    }
    //
  } else {
    console.log("Create Functionality");
    //
    gotofunctionality = 1;
    //
  }
  //---------------------------------------------------------------
  if (gotofunctionality == 1) {
    //
    if (
      filteredData.hasOwnProperty("phone") &&
      filteredData.phone.toString().length > 0 &&
      filteredData.hasOwnProperty("email") &&
      filteredData.email.length > 0
    ) {
      console.log("Valid Details Middleware");
      //
      const phone = filteredData.phone; //9999988888
      const email = filteredData.email;
      //
      const sql = con.query(
        "SELECT u.id from employees as u WHERE u.phone=?",
        //LEFT JOIN users_role as ur ON u.id=ur.users_id
        [phone],
        (err, response) => {
          //console.log(response);
          //----------------------------------------------------------------------------------------------
          if (!err) {
            if (response && response.length > 0) {
              console.log("Phone already exists");
              const Error = {
                status: "error",
                message: "Phone Already Exists",
              };
              res.status(400).json(Error);
            }
            ////////////////////////////////////////////////////////
            else {
              //No  PHONE found so now EMAIL check
              const sql1 = con.query(
                "SELECT u.id from employees as u WHERE u.email=?",
                //LEFT JOIN users_role as ur ON u.id=ur.users_id
                [email],
                (err, response) => {
                  //console.log(response);
                  if (!err) {
                    if (response && response.length > 0) {
                      console.log("Email already exists");
                      const Error = {
                        status: "error",
                        message: "Email Already Exists",
                      };
                      res.status(400).json(Error);
                    } else {
                      //no email found
                      console.log(" next () - no email no phone found in db");
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
              console.log(sql1.sql);
            }
            ////////////////////////////////////////////////////////////////
          } else {
            console.log("Middleware Error");
            console.log(err);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
          //-------------------------------------------------------------------------------------------------
        }
      );
      console.log(sql.sql);
      //
    } else {
      console.log("Invalid Details Middleware");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
  } else if (gotofunctionality == 2) {
    //
    if (
      filteredData.hasOwnProperty("phone") &&
      filteredData.phone.toString().length > 0
    ) {
      console.log("Valid Details Middleware");
      //
      const phone = filteredData.phone; //9999988888
      //
      const sql = con.query(
        "SELECT u.id from employees as u WHERE u.phone=?",
        //LEFT JOIN users_role as ur ON u.id=ur.users_id
        [phone],
        (err, response) => {
          //console.log(response);
          //----------------------------------------------------------------------------------------------
          if (!err) {
            if (response && response.length > 0) {
              console.log("Phone already exists");
              const Error = {
                status: "error",
                message: "Phone Already Exists",
              };
              res.status(400).json(Error);
            }
            ////////////////////////////////////////////////////////
            else {
              //No  PHONE found
              console.log(" next () - no email no phone found in db");
              console.log("No-record-Middleware");
              next();
            }
            ////////////////////////////////////////////////////////////////
          } else {
            console.log("Middleware Error");
            console.log(err);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
          //-------------------------------------------------------------------------------------------------
        }
      );
      console.log(sql.sql);
      //
    } else {
      console.log("Invalid Details Middleware");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
  } else if (gotofunctionality == 3) {
    //
    if (filteredData.hasOwnProperty("email") && filteredData.email.length > 0) {
      console.log("Valid Details Middleware");
      //
      const email = filteredData.email;
      //
      const sql1 = con.query(
        "SELECT u.id from employees as u  WHERE u.email=?",
        //LEFT JOIN users_role as ur ON u.id=ur.users_id
        [email],
        (err, response) => {
          //console.log(response);
          if (!err) {
            if (response && response.length > 0) {
              console.log("Email already exists");
              const Error = {
                status: "error",
                message: "Email Already Exists",
              };
              res.status(400).json(Error);
            } else {
              //no email found
              console.log(" next () - no email found in db");
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
      console.log(sql1.sql);
      //
    } else {
      console.log("Invalid Details Middleware");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
  }
};
//--------------------------------------------------------------------------------------------
//

//--------------------------------------------------------------------------------------------
module.exports = {
  checkemployee,
  checkemployeealready,
  //
};
