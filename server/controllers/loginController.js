const bcrypt = require("bcrypt");
const {
  accesstokencreation,
  refreshtokencreation,
} = require("../helpers/user-token-creation");
const {
  sql_query,
  view_query,
  edit_query,
  error_query,
} = require("../helpers/instructions");
var moment = require("moment");
const table_name = "employee";
//console.log("Inside Login controller");
//
//-------------------------------------------------------------------------------------------------------------
const Login = async (req, res) => {
  // console.log("Inside Login");
  const email = req.body.email;
  //console.log(email);
  const password = req.body.password; //password
  //console.log(password);
  //
  if (email && email.length > 0 && password && password.length > 0) {
    //check for user
    var db_userData;
    var db_user_id;
    var db_role_id;
    //
    var db_globalVariablesData;
    //
    var db_rolesData;
    //
    var db_rolesPermissionsData;
    //
    var error_g;
    var status_code_g;
    //
    //step-1 -- Get data for employee-------------STARTS
    //////////////////////////////////////////////////////////////////////////////////
    async function getUserData() {
      console.log("Inside getUserData");
      return new Promise(async (resolve, reject) => {
        const sql_query_payload = {
          // text = "'"+text+"'"
          sql_script:
            "SELECT u.id,  u.first_Name, u.last_Name, u.phone, u.email, u.image, u.active, u.password, ur.role as user_role_id, role.title as user_role, ur.active as user_role_active, ur.trash as user_role_trash FROM users_role as ur LEFT JOIN employee as u ON u.id= ur.users_id LEFT JOIN role ON role.id = ur.role WHERE ur.active = 1 && ur.trash = 0 && u.email=" +
            "'" +
            email +
            "'",
          method: "get",
        };
        //console.log(sql_query_payload);
        const respView = await sql_query(sql_query_payload);
        console.log("Back 1");
        //console.log(respView);
        if (respView.status == "success") {
          console.log("Success Employee Data Got");
          var rec_Data = respView.data;
          //
          //removing row data packet-------------STARTS
          db_userData = Object.values(JSON.parse(JSON.stringify(rec_Data)));
          //   console.log(resultUserDataArray);
          //removing row data packet-------------ENDS
          //
          //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
          resolve({
            result: 1,
          });
        } else if (respView.status == "error") {
          console.log("Back 1-E");
          //console.log("Error");
          const err = respView.message;
          //console.log(err); //{ code: 'NO_DATA', sqlMessage: 'No Data' }
          if (err == "NO_DATA") {
            //no role//no permissions
            console.log("No Roles No Permissions");
            error_g = {
              status: "error",
              message: "Not Authorized!! Please contact Administrator",
            };
            status_code_g = 403;
            //for passing to error---------------
            resolve({
              result: 5,
            });
            //for passing to error---------------
          } else if (err.code && err.code == "NO_DATA") {
            error_g = {
              status: "error",
              message: "Incorrect Credentials",
            };
            status_code_g = 403;
            //for passing to error---------------
            resolve({
              result: 5,
            });
            //for passing to error---------------
          } else {
            const respError = await error_query(err);
            console.log("Back 1-E");
            //console.log(respError);
            error_g = {
              status: "error",
              message: respError.message,
            };
            status_code_g = respError.statusCode;
            //for passing to error---------------
            resolve({
              result: 5,
            });
            //for passing to error---------------
          }
        }
      }).catch((error) => console.log(error.message));
    }
    const user_data_resp = await getUserData();
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(user_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //////////////////////////////////////////////////////////////////////////////////
    //step-1 -- Get data for employee-------------ENDS
    if (
      user_data_resp &&
      user_data_resp !== undefined &&
      Object.keys(user_data_resp).length != 0 &&
      user_data_resp.result == 1
    ) {
      console.log("STEP -1 SUCCESS");
      //Compare password ------------------------------------------------starts
      bcrypt.compare(
        password,
        db_userData[0].password,
        async (error, response) => {
          if (error) {
            console.log("Bcrypt Error");
            //console.log(error);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
          // console.log("password check");
          // console.log(response); //true or false
          // console.log("password check");
          if (response == true) {
            console.log("loginsuccess");
            db_user_id = db_userData[0].id;
            //const encodedid = encrypttheid(userId);
            //
            //step-2 get global variables ---------------------------------starts
            async function getglobalvariables() {
              console.log("Inside getglobalvariables");
              return new Promise(async (resolve, reject) => {
                const view_payload = {
                  table_name: "global_variable",
                  dataToGet: "*",
                };
                //console.log(view_payload);
                const respView = await view_query(view_payload);
                console.log("Back 2");
                //console.log(respView);
                if (respView.status == "success") {
                  //console.log("Success getglobalvariables Data Got");
                  //removing row data packet-------------STARTS
                  var resultGlobalData = Object.values(
                    JSON.parse(JSON.stringify(respView.data))
                  );
                  //  console.log(resultGlobalData);
                  //removing row data packet-------------ENDS
                  //
                  db_globalVariablesData = resultGlobalData;
                  //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                  resolve({
                    result: 1,
                  });
                  //console.log(respView);
                } else if (respView.status == "error") {
                  //console.log("Error");
                  const err = respView.message;
                  const respError = await error_query(err);
                  console.log("Back 2-E");
                  //console.log(respError);
                  error_g = {
                    status: "error",
                    message: respError.message,
                  };
                  status_code_g = respError.statusCode;
                  //for passing to error---------------
                  resolve({
                    result: 5,
                  });
                  //for passing to error---------------
                }
              }).catch((error) => console.log(error.message));
            }
            const get_global_variables_data_resp = await getglobalvariables();
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            console.log(get_global_variables_data_resp);
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            //step-2 get global variables ---------------------------------ends
            if (
              get_global_variables_data_resp &&
              get_global_variables_data_resp !== undefined &&
              Object.keys(get_global_variables_data_resp).length != 0 &&
              get_global_variables_data_resp.result == 1
            ) {
              console.log("STEP -2 SUCCESS");
              //step-3 get roles ---------------------------------starts
              async function getRoles(userID) {
                console.log("Inside getRoles");
                return new Promise(async (resolve, reject) => {
                  const view_payload = {
                    table_name: "users_role",
                    dataToGet: "id",
                    query_field: "users_id",
                    query_value: userID,
                  };
                  //console.log(view_payload);
                  const respView = await view_query(view_payload);
                  console.log("Back 3");
                  //console.log(respView);
                  if (respView.status == "success") {
                    //console.log("Success roles Data Got");
                    //removing row data packet-------------STARTS
                    var resultRolesData = Object.values(
                      JSON.parse(JSON.stringify(respView.data))
                    );
                    //  console.log(resultRolesData);
                    //removing row data packet-------------ENDS
                    //
                    db_rolesData = resultRolesData;
                    //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                    resolve({
                      result: 1,
                    });
                    //console.log(respView);
                  } else if (respView.status == "error") {
                    //console.log("Error");
                    const err = respView.message;
                    if (err.code == "NO_DATA") {
                      resolve({
                        result: 2,
                      });
                    } else {
                      const respError = await error_query(err);
                      console.log("Back 3-E");
                      //console.log(respError);
                      error_g = {
                        status: "error",
                        message: respError.message,
                      };
                      status_code_g = respError.statusCode;
                      //for passing to error---------------
                      resolve({
                        result: 5,
                      });
                      //for passing to error---------------
                    }
                  }
                }).catch((error) => console.log(error.message));
              }
              const roles_data_resp = await getRoles(db_user_id);
              console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
              console.log(roles_data_resp);
              console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
              //step-3 get roles ---------------------------------ends
              if (
                roles_data_resp &&
                roles_data_resp !== undefined &&
                Object.keys(roles_data_resp).length != 0 &&
                roles_data_resp.result == 1
              ) {
                console.log("ROLE EXISTS-STARTS");
                //GET ROLE id's of employeee---------------------Starts
                db_role_id = db_userData[0].user_role_id;
                //console.log(db_role_id);
                //GET ROLE id's of employeee---------------------Ends
                //STEP-4 -- Get THE PERMISSIONS wd MODULES NOW---------------STARTS
                async function getrolesPermissions() {
                  console.log("Inside getrolesPermissions");
                  return new Promise(async (resolve, reject) => {
                    const sql_query_payload = {
                      sql_script: `SELECT concat('"', UPPER(r.title), '":{"MODULES":{', GROUP_CONCAT(concat('"',m.name,'":"',urp.access,'"') SEPARATOR ','),'}}') as data FROM role_permission as urp LEFT JOIN module as m ON m.id=urp.module_id LEFT JOIN role as r ON r.id=urp.role_id WHERE urp.role_id=${db_role_id} GROUP BY r.title`,
                      method: "get",
                    };
                    //console.log(sql_query_payload);
                    const respView = await sql_query(sql_query_payload);
                    console.log("Back 4");
                    //console.log(respView);
                    if (respView.status == "success") {
                      console.log("Success rolepermissions Data Got");
                      //
                      //removing row data packet-------------STARTS
                      var resultPermissionsArray = Object.values(
                        JSON.parse(JSON.stringify(respView.data))
                      );
                      //   console.log(resultPermissionsArray);
                      //removing row data packet-------------ENDS
                      //
                      //now add curly braces and make json string---starts
                      const jsonStringData =
                        "{" + resultPermissionsArray[0].data + "}";
                      //console.log(jsonStringData);
                      //now add curly braces and make json string---ends
                      //
                      //nw parse the data-----------------STARTS
                      const jsonParsedData = JSON.parse(jsonStringData);
                      //  console.log(jsonParsedData);
                      //nw parse the data-----------------ENDS
                      //
                      db_rolesPermissionsData = jsonParsedData;
                      //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                      //
                      resolve({
                        result: 1,
                      });
                    } else if (respView.status == "error") {
                      //console.log("Error");
                      const err = respView.message;
                      console.log(err); //{ code: 'NO_DATA', sqlMessage: 'No Data' }
                      if (err.code == "NO_DATA") {
                        console.log("No Roles No Permissions");
                        error_g = {
                          status: "error",
                          message:
                            "Not Authorized!! Please contact Administrator",
                        };
                        status_code_g = 403;
                        //for passing to error---------------
                        resolve({
                          result: 5,
                        });
                        //for passing to error---------------
                      } else {
                        const respError = await error_query(err);
                        console.log("Back 4-E");
                        //console.log(respError);
                        error_g = {
                          status: "error",
                          message: respError.message,
                        };
                        status_code_g = respError.statusCode;
                        //for passing to error---------------
                        resolve({
                          result: 5,
                        });
                        //for passing to error---------------
                      }
                    }
                  }).catch((error) => console.log(error.message));
                }
                const getpermissions_data_resp = await getrolesPermissions();
                console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
                console.log(getpermissions_data_resp);
                console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
                //STEP-4 -- Get THE PERMISSIONS wd MODULES NOW---------------ENDS
                if (
                  getpermissions_data_resp &&
                  getpermissions_data_resp !== undefined &&
                  Object.keys(getpermissions_data_resp).length != 0 &&
                  getpermissions_data_resp.result > 0
                ) {
                  console.log("All data collected along wd permissions");
                  //STEP-5 -- creating access token and refresh token ------------STARTS
                  const accesstoken = accesstokencreation(db_user_id);
                  //console.log(accesstoken);
                  const accesstokenexpiry = moment().add(1, "hours");
                  //console.log(accesstokenexpiry);
                  const refreshtoken = refreshtokencreation(db_user_id);
                  // console.log(refreshtoken);
                  const refreshtokenexpiry = moment().add(1, "years");
                  //console.log(refreshtokenexpiry);
                  //STEP-5 -- creating access token and refresh token ------------ENDS
                  //
                  //STEP_6---updateUser----------------STARTS--------------------------------
                  let update_payload = {
                    table_name: table_name,
                    query_field: "id",
                    query_value: db_user_id,
                    dataToSave: {
                      access_token: accesstoken,
                      access_token_expires_in: accesstokenexpiry,
                      refresh_token: refreshtoken,
                      refresh_token_expires_in: refreshtokenexpiry,
                    },
                  };
                  //
                  async function updateUser(saveData) {
                    //  console.log("Inside updateUser");
                    //   console.log(saveData);
                    const respEdit = await edit_query(saveData);
                    console.log("Back 6");
                    //console.log(respEdit);
                    if (respEdit.status == "success") {
                      console.log("Success User Updated");
                      //
                      //collect data req from user---starts
                      var output = db_userData[0];
                      delete output.password;
                      delete output.id;
                      output["access_token"] = accesstoken;
                      output["refresh_token"] = refreshtoken;
                      output["permissions"] = db_rolesPermissionsData;
                      output["global"] = db_globalVariablesData;
                      //collect data req from user---ends
                      //
                      const Response = {
                        message: "success",
                        responsedata: output,
                      };
                      res.status(200).json(Response);
                      //
                    } else if (respEdit.status == "error") {
                      // console.log("Error");
                      const err = respEdit.message;
                      const respError = await error_query(err);
                      console.log("Back 6-E");
                      //  console.log(respError);
                      const Error = {
                        status: "error",
                        message: respError.message,
                      };
                      res.status(respError.statusCode).json(Error);
                    }
                  }
                  await updateUser(update_payload);
                  //STEP_6---updateUser----------------ENDs--------------------------------
                  //------------------------------------------------------
                } else {
                  console.log("STEP-4 ERROR - This Case should never work");
                  res.status(status_code_g).json(error_g);
                }
              } else {
                console.log("Error in getting roles Step-3");
                res.status(status_code_g).json(error_g);
              }
            } else {
              console.log("Get Global Variables Data Error Step-2");
              res.status(status_code_g).json(error_g);
            }
          } else {
            //console.log("Wrong username/password combination!");
            const Response = {
              message: "Wrong username/password combination!",
            };
            res.status(203).json(Response);
          }
        }
      );
      //Compare password ------------------------------------------------ends
    } else {
      console.log("Get User Data Error Step-1");
      res.status(status_code_g).json(error_g);
    }
  } else {
    //console.log("Invalid Details");
    const Response = {
      message: "Invalid Details",
    };
    res.status(400).json(Response);
  }
};
//-------------------------------------------------------------------------------------------------------------
//
module.exports = {
  Login,
};
