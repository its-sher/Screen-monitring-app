var moment = require("moment");
const con = require("../models/db");
const bcrypt = require("bcrypt");
const {
  accesstokencreation,
  refreshtokencreation,
} = require("../helpers/user-token-creation");
const { base64encode, base64decode } = require("nodejs-base64");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
const { add, view, errorHelper, edit } = require("../helpers/instructions");

//
console.log("Inside User controller");
const table_name = "employees";
//
//-------------------------------------------------------------------------------------------------------------
const CreateAccessRefreshToken = async (req, res) => {
  console.log("Inside CreateAccessRefreshToken");
  const headersvalue = req.headers; //----FOR All Now
  //console.log(headersvalue);
  //
  //Data Processing ----------------------------------------STARTS
  const basic_auth = req.headers.authorization; //Basic YWJjQGdtYWlsLmNvbTpwYXNzd29yZDFA
  //console.log(basic_auth);
  const basicAuthDataArray = basic_auth.split(" "); //[ 'Basic', 'YWJjQGdtYWlsLmNvbTpwYXNzd29yZDFA' ]
  //console.log(basicAuthDataArray);
  const encodeddata = basicAuthDataArray[1]; //YWJjQGdtYWlsLmNvbTpwYXNzd29yZDFA
  //console.log(encodeddata);
  const decoded = base64decode(encodeddata); //abc@gmail.com:password1@
  //console.log(decoded);
  decodedDataArray = decoded.split(":"); //[ 'abc@gmail.com', 'password1@' ]
  //console.log(decodedDataArray);
  const email = decodedDataArray[0]; //"abc@gmail.com"
  //console.log(email);
  const password = decodedDataArray[1]; //"password1@"
  //console.log(password);
  //Data Processing ----------------------------------------_ENDS
  //
  //Check for user/password, if genuine or not --STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const sql = con.query(
    "SELECT id, first_Name, last_Name, phone, email, image, password FROM " +
      [table_name] +
      " WHERE email=?", //active,
    [email],
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
                  //console.log("loginsuccess");
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
                  //creating access token and refresh token ------------STARTS
                  //
                  const accesstoken = accesstokencreation(resultUserDataArray);
                  //console.log(accesstoken);
                  const refreshtoken =
                    refreshtokencreation(resultUserDataArray);
                  // console.log(refreshtoken);
                  //
                  //creating access token and refresh token ------------STARTS
                  //
                  //collect data req from user---starts
                  var payload = resultUserDataArray[0];
                  delete payload.password;
                  payload["access_token"] = accesstoken;
                  payload["refresh_token"] = refreshtoken;
                  //collect data req from user---ends
                  //
                  let update_payload = {
                    table_name: table_name,
                    query_field: "id",
                    query_value: userId,
                    dataToSave: {
                      access_token: accesstoken,
                      refresh_token: refreshtoken,
                    },
                  };
                  //
                  //STEP_1---updateUser----------------STARTS
                  //------------------------------------------------------
                  async function updateUser(saveData) {
                    console.log("Inside updateUser");
                    //   console.log(saveData);
                    const respEdit = await edit(saveData);
                    console.log("Back 1");
                    //console.log(respEdit);
                    if (respEdit.status == "success") {
                      console.log("Success User Updated");
                      //
                      const Response = {
                        message: "success",
                        // accesstoken: accesstoken,
                        // refreshtoken: refreshtoken,
                        responsedata: payload,
                      };
                      res.status(200).json(Response);
                      //
                    } else if (respEdit.status == "error") {
                      console.log("Error");
                      const err = respEdit.message;
                      const respError = await errorHelper(err);
                      console.log("Back 2");
                      //  console.log(respError);
                      const Error = {
                        status: "error",
                        message: respError.message,
                      };
                      res.status(respError.statusCode).json(Error);
                    }
                  }
                  await updateUser(update_payload);
                  //STEP_1---updateUser----------------ENDS
                  //------------------------------------------------------
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
  //Check for user/password, if genuine or not --ENDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // const Response = {
  //   message: "success",
  //   data: decoded,
  //   email,
  //   password,
  // };
  // res.status(201).json(Response);

  //console.log(req.body.postID);
  // const encryptedid = req.params.id;
  // const userId = decodetheid(encryptedid);
  // // console.log(userId);
  // if (userId && userId > 0) {
  //   //
  //   var users_data = {};
  //   var users_data_resp = {};
  //   //
  //   var users_roles_data = {};
  //   var users_roles_data_resp = {};
  //   //
  //   //STEP-1 NOW GET Users Details from users table---++++++++++++++starts
  //   //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
  //   //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //   //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //   //
  //   console.log("STEP-1 STARTS");
  //   async function getUsersData(userID) {
  //     console.log("Inside getUsersData");
  //     return new Promise((resolve, reject) => {
  //       //   console.log(userID);
  //       //
  //       const sql = con.query(
  //         //mine
  //         //"SELECT id, CONCAT(first_Name, ' ', last_Name) AS fullname, roles, phone, email,  address_line1, address_line2, city, state, country, postal_code, active,  date_of_birth, gender, created_at from users WHERE id=?",
  //         //sir
  //         // "SELECT users.id, users.first_Name, users.last_Name, role.title as roles, users.phone, users.email,  users.address_line1, users.address_line2, users.city, users.state, users.country, users.postal_code, users.active, users.date_of_birth, users.gender, users.created_at, users.updated_at, users.verification_code from users LEFT JOIN users_role ON users_role.users_id = users.id LEFT JOIN role ON users_role.role = role.id WHERE users.id=?",
  //         //mine
  //         "SELECT u.id, u.first_Name, u.last_Name, u.nick_name, u.description, u.phone, u.phone_verify, u.email, u.email_verify, u.current_store, u.address_line1, u.address_line2, u.city, u.state, u.country, u.postal_code,  CONCAT('" +
  //           domainpath +
  //           "', u.image) as image, u.gender, u.date_of_birth, u.employee_id, u.active FROM users as u WHERE u.id=?", //DATE_FORMAT(u.date_of_birth, '%d-%m-%Y') AS date_of_birth, u.password,
  //         [userID],
  //         (err, response) => {
  //           if (!err) {
  //             //console.log(response);
  //             if (response && response.length > 0) {
  //               //
  //               //removing row data packet-------------STARTS
  //               var resultArray = Object.values(
  //                 JSON.parse(JSON.stringify(response))
  //               );
  //               // console.log(resultArray);
  //               //removing row data packet-------------ENDS
  //               //
  //               //Enc Order id -- STARTS
  //               let result1 = resultArray.map((item) => {
  //                 const decOrderId = item.id;
  //                 item.id = encrypttheid(decOrderId);
  //                 return item;
  //               });
  //               //Enc Order id -- ENDS
  //               //
  //               // const Response = {
  //               //   status: "success",
  //               //   responsedata: { user: result1 },
  //               // };
  //               // res.status(200).json(Response);
  //               users_data = result1; //data into global variable
  //               //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
  //               resolve({
  //                 result: 1,
  //               });
  //             } else {
  //               console.log("STEP_1 ERROR");
  //               console.log("SQL ERROR - No data Got - Sql Query - Get user");
  //               // const Error = {
  //               //   status: "error",
  //               //   message: "No Data",
  //               // };
  //               // res.status(204).json(Response);
  //               reject({
  //                 result: 0,
  //               });
  //             }
  //           } else {
  //             console.log("STEP_1 ERROR");
  //             console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
  //             console.log("Get User sql error");
  //             console.log(err);
  //             // const Error = {
  //             //   status: "error",
  //             //   message: "Server Error",
  //             // };
  //             // res.status(400).json(Error);
  //             reject({
  //               result: 0,
  //             });
  //           }
  //         }
  //       );
  //       console.log(sql.sql);
  //       //
  //     }).catch((error) => console.log(error.message));
  //   }
  //   users_data_resp = await getUsersData(userId);
  //   console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
  //   // console.log(users_data_resp);
  //   console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
  //   //STEP-1 NOW GET Users Details from users table---++++++++++++++ends
  //   //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
  //   //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //   //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //   //
  //   if (
  //     users_data_resp &&
  //     users_data_resp !== undefined &&
  //     Object.keys(users_data_resp).length != 0 &&
  //     users_data_resp.result > 0
  //   ) {
  //     console.log("STEP-1 DONE SUCCESSFULLY");
  //     console.log("STEP-2 STARTS");
  //     //STEP-2 NOW GET Users ROLES from users_role table---++++++++++++++starts
  //     //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
  //     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //     //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //     //
  //     async function getUsersRolesData(userID) {
  //       console.log("Inside getUsersRolesData");
  //       return new Promise((resolve, reject) => {
  //         //   console.log(userID);
  //         //
  //         const sql = con.query(
  //           "SELECT ur.id as users_role_id, ur.store_type as store_type_id, st.name as store_type_name, ur.store_id, s.name as store_name, ur.role as role_id, r.title as role_name, ur.active FROM users_role as ur LEFT JOIN store_type as st ON st.id=ur.store_type LEFT JOIN stores as s ON s.id=ur.store_id LEFT JOIN role as r ON r.id=ur.role WHERE ur.trash = 0 AND ur.users_id=?",
  //           [userID],
  //           (err, response) => {
  //             if (!err) {
  //               //console.log(response);
  //               if (response && response.length > 0) {
  //                 //
  //                 //removing row data packet-------------STARTS
  //                 var resultArray = Object.values(
  //                   JSON.parse(JSON.stringify(response))
  //                 );
  //                 // console.log(resultArray);
  //                 //removing row data packet-------------ENDS
  //                 //
  //                 users_roles_data = resultArray; //data into global variable
  //                 //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
  //                 resolve({
  //                   result: 1,
  //                 });
  //               } else {
  //                 console.log("STEP_2 ERROR");
  //                 console.log(
  //                   "SQL ERROR - No data Got - Sql Query - Get user ROles"
  //                 );
  //                 // const Error = {
  //                 //   status: "error",
  //                 //   message: "No Data",
  //                 // };
  //                 // res.status(204).json(Response);
  //                 reject({
  //                   result: 0,
  //                 });
  //               }
  //             } else {
  //               console.log("STEP_2 ERROR");
  //               console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
  //               console.log("Get User ROles - sql error");
  //               console.log(err);
  //               // const Error = {
  //               //   status: "error",
  //               //   message: "Server Error",
  //               // };
  //               // res.status(400).json(Error);
  //               reject({
  //                 result: 0,
  //               });
  //             }
  //           }
  //         );
  //         console.log(sql.sql);
  //         //
  //       }).catch((error) => console.log(error.message));
  //     }
  //     users_roles_data_resp = await getUsersRolesData(userId);
  //     console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
  //     // console.log(users_roles_data_resp);
  //     console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
  //     //STEP-2 NOW GET Users ROLES from users_role table---++++++++++++++ends
  //     //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
  //     //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //     //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //     //
  //     if (
  //       users_roles_data_resp &&
  //       users_roles_data_resp !== undefined &&
  //       Object.keys(users_roles_data_resp).length != 0 &&
  //       users_roles_data_resp.result > 0
  //     ) {
  //       console.log("STEP-2 DONE SUCCESSFULLY");
  //       console.log("STEP-3 STARTS");
  //       //DATA MATCH N COMPILE -------------------STARTS
  //       console.log(users_data);
  //       console.log(users_roles_data);
  //       users_data[0].roles = users_roles_data;
  //       console.log(users_data);
  //       const Response = {
  //         status: "success",
  //         responsedata: { user: users_data },
  //       };
  //       res.status(200).json(Response);
  //       //DATA MATCH N COMPILE -------------------ENDS
  //       console.log("STEP-3 ENDS");
  //     } else {
  //       console.log("STEP 2 Error");
  //       const Error = {
  //         status: "error",
  //         message: "Server Error",
  //       };
  //       res.status(400).json(Error);
  //     }
  //   } else {
  //     console.log("STEP 1 Error");
  //     const Error = {
  //       status: "error",
  //       message: "Server Error",
  //     };
  //     res.status(400).json(Error);
  //   }
  //   //
  // } else {
  //   const Error = { status: "error", message: "Invalid Details" };
  //   res.status(400).json(Error);
  // }
};
//-----------------------------------------------------------------------------------------------------------
//
module.exports = {
  CreateAccessRefreshToken,
};
