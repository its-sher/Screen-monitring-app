const con = require("../models/db");
const bcrypt = require("bcrypt");
const { usertokencreation } = require("../helpers/user-token-creation");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
console.log("inside Login controller");
const table_name = "employees";

//
const LoginUser = async (req, res) => {
  console.log("Login User");
  //console.log(req.session);
  //console.log("Node-inside login ");
  //console.log(req);
  const phoneoremailvalue = req.body.phoneoremail; //9999988888
  const password = req.body.password; //password is password (hashed)

  //validating email address or mobile number
  var checkemailorphone = isValidEmail(phoneoremailvalue); // true
  function isValidEmail(phoneoremailvalue) {
    //console.log(!isNaN(phoneoremailvalue));
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (
      phoneoremailvalue.match(emailRegex) &&
      typeof phoneoremailvalue === "string"
    ) {
      return "email";
    } else if (!isNaN(phoneoremailvalue)) {
      return "phone";
    }
  }

  if (
    (checkemailorphone == "email" || checkemailorphone == "phone") &&
    checkemailorphone.length > 0
  ) {
    //9-bcz phone num is min 10digits and email is also more than 9 digits
    // console.log(phoneoremailvalue);
    //check for user
    // const sql = con.query(
    con.query(
      "SELECT id, first_Name, last_Name, phone, email, image, active, password FROM " +
        [table_name] +
        " WHERE " +
        checkemailorphone +
        " = ?",
      [phoneoremailvalue],
      async (err, result) => {
        if (!err) {
          //console.log(result);
          if (result && result.length > 0) {
            console.log("user exists");
            //console.log(result);
            //console.log(result);
            bcrypt.compare(
              password,
              result[0].password,
              async (error, response) => {
                if (!error) {
                  // console.log("password check");
                  // console.log(response); //true or false
                  // console.log("password check");
                  if (response == true) {
                    //console.log(req.body);
                    //
                    const userId = result[0].id;
                    const encodedid = encrypttheid(userId);
                    //
                    //removing row data packet-------------STARTS
                    var resultUserDataArray = Object.values(
                      JSON.parse(JSON.stringify(result))
                    );
                    //   console.log(resultUserDataArray);
                    //removing row data packet-------------ENDS
                    //
                    //HANDLING SESSION-------------------------------------------++++++++++++++++++++++++++++++++++++++++++++++++++++STARTS
                    //create user token start--save that encrypted access token in db n cookie
                    const token = usertokencreation(result);
                    // //
                    // var ip =
                    //   req.header("x-forwarded-for") ||
                    //   req.connection.remoteAddress;
                    // //console.log("IP ADDRESS-->" + ip);
                    // //SESSION has cookie------------------------------------------------------------1
                    // //ADDING DATA TO SESSION (NOT TABLE)---------------STARTS
                    // req.session.users_id = encodedid; //session gets users_id------------------------2
                    // req.session.accesstoken = token; //session gets accesstoken-----------------------3
                    // //
                    // //  console.log("Session id");
                    // const sessionID = req.sessionID; //session id used to save data in row
                    // //  console.log(sessionID);
                    // req.session.sess_id = sessionID; //session gets session id-----------------------------4
                    // //
                    // req.session.ipaddress = ip; //session gets ipaddress-----------------------------5
                    // // req.session.isAuth = true;
                    // req.session.login = true; //session gets login------------------------------------6
                    // //
                    // //
                    // //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxx
                    // //active status for user
                    // req.session.active = result[0].active; //session gets active value-----------------------------------6-B
                    // //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxxxx
                    // //
                    // //ADDING DATA TO SESSION (NOT TABLE)----------------ENDS
                    // // console.log("Final Session");
                    // //  console.log(req.session);
                    // //Colect Data to update in session table, then update it **********************************STARTS
                    // //
                    // const UseridTokenData = {
                    //   //users_id: userId,//ezmoov-->this was used
                    //   users_id: encodedid, //teamlogger-->this is used
                    //   access_token: token,
                    //   ipaddress: ip,
                    //   entity: "Employee",
                    // };
                    // //console.log(UseridTokenData);
                    // //start-11111^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // setTimeout(function () {
                    //   const sql = con.query(
                    //     // con.query(
                    //     "UPDATE sessions SET ? WHERE session_id=?",
                    //     [UseridTokenData, sessionID],
                    //     (err, result) => {
                    //       if (!err) {
                    //         //console.log(result);
                    //         if (result.changedRows > 0) {
                    //           console.log(
                    //             "Record Updated wd token n dash-user id"
                    //           );
                    //         } else {
                    //           console.log("Update Error --  NOTHING UPDATED");
                    //           const Error = {
                    //             status: "error",
                    //             message: "Server Error",
                    //           };
                    //           res.status(400).json(Error);
                    //         }
                    //       } else {
                    //         console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                    //         console.log(err);
                    //         const Error = {
                    //           status: "error",
                    //           message: "Server Error",
                    //         };
                    //         res.status(400).json(Error);
                    //       }
                    //     }
                    //   );
                    //   console.log(sql.sql);
                    // }, 1000);
                    // //ends--11111^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                    // //Colect Data to update in session table, then update it **********************************ENDS
                    // //HANDLING SESSION-------------------------------------------++++++++++++++++++++++++++++++++++++++++++++++++++++ENDS
                    // //
                    // const sessdata = req.session;
                    const Response = {
                      login: true,
                      sessdata,
                      message: "login success",
                    };
                    //console.log("loginsuccess");
                    res.status(200).json(Response);
                    //
                  } else {
                    console.log("Wrong username/password combination!");
                    const Response = {
                      message: "Wrong username/password combination!",
                    };
                    res.status(203).json(Response);
                  }
                  //
                } else {
                  console.log("Bcrypt Error");
                  console.log(error);
                  const Error = { status: "error", message: "Server Error" };
                  res.status(400).json(Error);
                }
                //
              }
            );
          } else {
            console.log("no user");
            const Response = {
              message: "User doesn't exist",
            };
            res.status(204).json(Response);
          }
          //
        } else {
          console.log(err);
          const Error = { status: "error", message: "Server Error" };
          res.status(400).json(Error);
        }
        //
      }
    );
    //console.log(sql.sql);
  } else {
    console.log("Neither email nor Phone");
    const Response = {
      message: "Neither email nor Phone",
    };
    res.status(204).json(Response);
  }
  //
};
//-------------------------------------------------------------------------------------------------------------
// Check CheckIfUserLoggedin----- if session exists then logged in true--------------------------------------------------------------
const CheckIfUserLoggedIn = async (req, res) => {
  console.log("11--inside check user logged in or not ");
  // console.log(req.session);
  if (req.session.users_id) {
    console.log("SESSION EXISTS");
    //
    //get user id from session+decode+int id
    const userid = req.session.users_id;
    const intuserid = decodetheid(userid);
    //
    //get session id from session
    const sessionid = req.session.id;
    //console.log("session id" + sessionid);
    //
    //get accesstoken from session
    const accesstoken = req.session.accesstoken;
    //console.log(accesstoken);
    //
    //const sql = con.query(
    const sql = con.query(
      "SELECT * from sessions WHERE (users_id=? AND session_id=? AND access_token=?)",
      [intuserid, sessionid, accesstoken],
      async (err, response) => {
        //console.log("query" + response);
        if (!err) {
          if (response && response.length > 0) {
            console.log("Get Session Record Successful");
            //  console.log(response);
            //
            //removing row data packet-------------STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var resultArray = Object.values(
              JSON.parse(JSON.stringify(response))
            );
            // console.log(resultArray);
            //removing row data packet-------------ENDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            //Now Get Data into Response--starts))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
            //
            //--1-----get data from session record -- data variable-------------starts
            //
            const data_db_json_string = resultArray[0].data;
            //  console.log(data_db_json_string);
            //--------------------------------------------------------
            //
            const sessdata = JSON.parse(data_db_json_string);
            //   console.log(sessdata);
            //
            //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
            var db_globalVariablesData;
            var global_variables_data_resp = {};
            //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
            //
            //STEP-1 -- Get Global Variables ---STARTS+++++++++++++++++
            //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            async function getglobalvariables() {
              console.log("Inside getglobalvariables");
              return new Promise((resolve, reject) => {
                //
                const sql = con.query(
                  "SELECT * FROM `global_variables`",
                  async (err, result) => {
                    if (!err) {
                      //  console.log(result);
                      if (result && result.length > 0) {
                        //console.log(result);
                        console.log("Data is there in global variables");
                        //
                        //removing row data packet-------------STARTS
                        var resultGlobalData = Object.values(
                          JSON.parse(JSON.stringify(result))
                        );
                        //  console.log(resultGlobalData);
                        //removing row data packet-------------ENDS
                        //
                        db_globalVariablesData = resultGlobalData;
                        //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                        resolve({
                          result: 1,
                        });
                      } else {
                        console.log("No data in global variables");
                        // const Error = {
                        //   status: "error",
                        //   message: "Server Error",
                        // };
                        // res.status(204).json(Error);
                        reject({
                          result: 0,
                        });
                      }
                    } else {
                      console.log(err);
                      // const Error = { status: "error", message: "Server Error" };
                      // res.status(400).json(Error);
                      reject({
                        result: 0,
                      });
                    }
                  }
                );
                //console.log(sql);
              }).catch((error) => console.log(error.message));
            }
            global_variables_data_resp = await getglobalvariables();
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            console.log(global_variables_data_resp);
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            //STEP++++++++++++++++COMPLETES++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //STEP-1 -- Get Global Variables ---ENDS+++++++++++++++++
            //
            if (
              global_variables_data_resp &&
              global_variables_data_resp !== undefined &&
              Object.keys(global_variables_data_resp).length != 0 &&
              global_variables_data_resp.result > 0
            ) {
              console.log("Get Global Variables Data Success");
              //
              const Response = {
                login: true,
                sessdata,
                global: db_globalVariablesData,
              };
              res.status(200).json(Response);
              //
            } else {
              console.log("Get Global Variables Data Error");
              const Error = {
                status: "error",
                message: "Server Error",
              };
              res.status(400).json(Error);
            }

            //Now Get Data into Response--ends))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
            //
          } else {
            console.log("This case should not WORK");
            console.log("No Session Data");
            const Error = {
              status: "error",
              message: "No Data",
            };
            res.status(204).json(Error);
          }
        } else {
          console.log(err);
          const Error = {
            status: "error",
            message: "Server Error",
          };
          res.status(400).json(Error);
        }
      }
    );
    console.log(sql.sql);
  } else {
    console.log("not logged in");
    res.clearCookie("logedIn");
    res.clearCookie("sid");
    res.send({ login: false });
  }
};
//-------------------------------------------------------------------------------------------------------------
// Check GetUserLoggedinId----- if session exists then send encrypted id--------------------------------------------------------------
const GetUserLoggedinId = (req, res) => {
  console.log("11--inside check user logged in to get id and session id");
  console.log(req.session);
  if (req.session.users_id) {
    //get user id from session+decode+int id
    const userid = req.session.users_id;
    const intuserid = decodetheid(userid);
    //get session id from session
    const sessionid = req.session.id;
    //console.log("session id" + sessionid);
    //get accesstoken from session
    const accesstoken = req.session.accesstoken;
    //console.log(accesstoken);
    //console.log(req.session.id);

    //const sql = con.query(
    con.query(
      "SELECT * from sessions WHERE (users_id=? AND session_id=? AND access_token=?)",
      [intuserid, sessionid, accesstoken],
      (err, response) => {
        console.log("query" + response);
        if (!err) {
          if (response && response.length) {
            //console.log("ddddddddddddddddddddd");
            //console.log(response);
            con.query(
              "SELECT id from users WHERE id=?",
              [intuserid],
              (err, resp) => {
                //ENCODE ID - userid
                const userId1 = resp[0].id;
                const encodedid = encrypttheid(userId1);
                //ends
                //console.log(resp[0].roles);
                //console.log(req.header);
                console.log("sending id of logged in user");

                res.status(200).send({ user: encodedid, session: sessionid });
              }
            );
          } else {
            console.log("Not Logged in");
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
            //res.send(Error);
          }
        } else {
          console.log(err);
          const Error = { status: "error", message: "Server Error" };
          res.status(400).json(Error);
        }
      }
    );
    //console.log(sql.sql);
  } else {
    console.log("not logged in");
    res.status(400).send();
  }
};
//-------------------------------------------------------------------------------------------------------------
//Logout User
const Logout = (req, res) => {
  console.log("inside logout node");
  res.clearCookie("logedIn");
  res.clearCookie("sid");

  console.log("inside logout node DONE");
  res.status(200).send("DONE");
  //res.status(200).redirect("/login"); //gets redirected unecessary to /login
  //return res.status(200).end();
  // req.session.destroy((err) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     //both below commands del session from db wd error
  //     //solution--SET FOREIGN_KEY_CHECKS=0; -- to disable them
  //     //cookie.set("testtoken", { expires: Date.now() });
  //     //cookie.set("testtoken", { maxAge: 0 });
  //     const Response = {
  //       message: "Logout Successfull Session Destroyed",
  //     };
  //     res.status(200).json(Response);
  //   }
  // });
};
//-------------------------------------------------------------------------------------------------------------
//USER LOGIN ___________________________________________________ENDS
//
// Add a user  into database table --users-DONE--------------------------------------------------------------
//
module.exports = {
  LoginUser,
  CheckIfUserLoggedIn,
  GetUserLoggedinId,
  Logout,
};
