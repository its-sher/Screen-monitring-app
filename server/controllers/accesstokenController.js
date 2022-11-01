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
const { base64encode, base64decode } = require("nodejs-base64");
const table_name = "employee";
//console.log("Inside Access Token controller");
//
//-------------------------------------------------------------------------------------------------------------
const CreateAccessRefreshToken = async (req, res) => {
  console.log("Inside CreateAccessRefreshToken");
  //const headersvalue = req.headers; //----FOR All Now
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
  if (email && email.length > 0 && password && password.length > 0) {
    //
    var userDataDb;
    //Get data for employee-------------STARTS
    //////////////////////////////////////////////////////////////////////////////////
    async function getDataFunc() {
      console.log("Inside getDataFunc");
      let view_payload = {
        table_name: table_name,
        query_field: "email",
        query_value: email,
        dataToGet: "id, password",
      };
      const respView = await view_query(view_payload);
      console.log("Back 1");
      //console.log(respView);
      if (respView.status == "success") {
        console.log("Success Employee Data Got");
        userDataDb = respView.data;

        //Compare password ------------------------------------------------starts
        bcrypt.compare(
          password,
          userDataDb[0].password,
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
              const userId = userDataDb[0].id;
              //console.log(userId);
              //const encodedid = encrypttheid(userId);
              //
              //creating access token and refresh token ------------STARTS
              const accesstoken = accesstokencreation(userId);
              //console.log(accesstoken);
              const accesstokenexpiry = moment().add(1, "hours");
              //console.log(accesstokenexpiry);
              const refreshtoken = refreshtokencreation(userId);
              // console.log(refreshtoken);
              const refreshtokenexpiry = moment().add(1, "years");
              //console.log(refreshtokenexpiry);
              //creating access token and refresh token ------------ENDS
              //
              let update_payload = {
                table_name: table_name,
                query_field: "id",
                query_value: userId,
                dataToSave: {
                  access_token: accesstoken,
                  access_token_expires_in: accesstokenexpiry,
                  refresh_token: refreshtoken,
                  refresh_token_expires_in: refreshtokenexpiry,
                },
              };
              //
              //STEP_2---updateUser----------------STARTS
              //------------------------------------------------------
              async function updateUser(saveData) {
                console.log("Inside updateUser");
                //   console.log(saveData);
                const respEdit = await edit_query(saveData);
                console.log("Back 2");
                //console.log(respEdit);
                if (respEdit.status == "success") {
                  console.log("Success User Updated");
                  //
                  const output = {
                    access_token: accesstoken,
                    refresh_token: refreshtoken,
                  };
                  const Response = {
                    message: "success",
                    responsedata: output,
                  };
                  res.status(200).json(Response);
                  //
                } else if (respEdit.status == "error") {
                  console.log("Error");
                  const err = respEdit.message;
                  console.log(err);
                  const respError = await error_query(err);
                  console.log("Back 2-E");
                  //  console.log(respError);
                  const Error = {
                    status: "error",
                    message: respError.message,
                  };
                  res.status(respError.statusCode).json(Error);
                }
              }
              await updateUser(update_payload);
              //STEP_2---updateUser----------------ENDS
              //------------------------------------------------------
            } else {
              console.log("Wrong username/password combination!");
              const Response = {
                message: "Wrong username/password combination!",
              };
              res.status(203).json(Response);
            }
          }
        );
        //Compare password ------------------------------------------------ends
      } else if (respView.status == "error") {
        console.log("Error");
        const err = respView.message;
        console.log(err);
        if (err.code && err.code == "NO_DATA") {
          const error_g = {
            status: "error",
            message: "Incorrect Credentials",
          };
          const status_code_g = 403;
          res.status(status_code_g).json(error_g);
        } else {
          const respError = await error_query(err);
          console.log("Back 1-E");
          //console.log(respError);
          const Error = {
            status: "error",
            message: respError.message,
          };
          res.status(respError.statusCode).json(Error);
        }
      }
    }
    await getDataFunc();
    //////////////////////////////////////////////////////////////////////////////////
    //Get data for employee-------------ENDS
    //
  } else {
    //console.log("Invalid Details");
    const Response = {
      message: "Invalid Details",
    };
    res.status(400).json(Response);
  }
};
//-----------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------------------------------------
const RegenerateAccessToken = async (req, res) => {
  console.log("Inside RegenerateAccessToken");
  //const headersvalue = req.headers; //----FOR All Now
  //console.log(headersvalue);
  //
  //Data Processing ----------------------------------------STARTS
  const refresh_token = req.headers.refresh_token; //2ddd99fa44e568b4b82ef3c3f3be2f22
  //console.log(refresh_token);
  const api_key = req.headers.api_key; //OThiNzY4ZDdhNmFiOGUwNGQxZWQxNjQ3NGFjNzQ1MzA
  //console.log(api_key);
  //Data Processing ----------------------------------------_ENDS
  //
  var userDataDb;
  //Get data for employee-------------STARTS
  //////////////////////////////////////////////////////////////////////////////////
  async function getDataFunc() {
    console.log("Inside getDataFunc");
    const sql_query_payload = {
      sql_script:
        `SELECT id FROM ${table_name} WHERE refresh_token=` +
        "'" +
        refresh_token +
        "'" +
        `AND api_key=` +
        "'" +
        api_key +
        "'",
      method: "get",
    };
    //console.log(sql_query_payload);
    const respView = await sql_query(sql_query_payload);
    console.log("Back 1");
    //console.log(respView);
    if (respView.status == "success") {
      console.log("Success Employee Data Got");
      userDataDb = respView.data;
      const userId = userDataDb[0].id;
      //
      //creating access token and refresh token ------------STARTS
      const accesstoken = accesstokencreation(userId);
      //console.log(accesstoken);
      const accesstokenexpiry = moment().add(1, "hours");
      //console.log(accesstokenexpiry);
      const refreshtoken = refreshtokencreation(userId);
      // console.log(refreshtoken);
      const refreshtokenexpiry = moment().add(1, "years");
      //console.log(refreshtokenexpiry);
      //creating access token and refresh token ------------ENDS
      //
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: userId,
        dataToSave: {
          access_token: accesstoken,
          access_token_expires_in: accesstokenexpiry,
          refresh_token: refreshtoken,
          refresh_token_expires_in: refreshtokenexpiry,
        },
      };
      //
      //STEP_2---updateUser----------------STARTS
      //------------------------------------------------------
      async function updateUser(saveData) {
        console.log("Inside updateUser");
        //   console.log(saveData);
        const respEdit = await edit_query(saveData);
        console.log("Back 2");
        //console.log(respEdit);
        if (respEdit.status == "success") {
          console.log("Success User Updated");
          //
          const output = {
            access_token: accesstoken,
            refresh_token: refreshtoken,
          };
          const Response = {
            message: "success",
            responsedata: output,
          };
          res.status(200).json(Response);
          //
        } else if (respEdit.status == "error") {
          console.log("Error");
          const err = respEdit.message;
          console.log(err);
          const respError = await error_query(err);
          console.log("Back 2-E");
          //  console.log(respError);
          const Error = {
            status: "error",
            message: respError.message,
          };
          res.status(respError.statusCode).json(Error);
        }
      }
      await updateUser(update_payload);
      //STEP_2---updateUser----------------ENDS
      //------------------------------------------------------
    } else if (respView.status == "error") {
      console.log("Error");
      const err = respView.message;
      console.log(err);
      if (err == undefined) {
        const Error = {
          status: "error",
          message: "Invalid Auth Details",
        };
        res.status(203).json(Error);
      } else if (err == "NO_DATA") {
        //no role//no permissions
        console.log("No Data");
        const error_g = {
          status: "error",
          message: "Not Authorized!!",
        };
        const status_code_g = 403;
        res.status(status_code_g).json(error_g);
      } else if (err.code && err.code == "NO_DATA") {
        const error_g = {
          status: "error",
          message: "Not Authorized!!",
        };
        const status_code_g = 403;
        res.status(status_code_g).json(error_g);
      } else {
        const respError = await error_query(err);
        console.log("Back 1-E");
        //console.log(respError);
        const error_g = {
          status: "error",
          message: respError.message,
        };
        const status_code_g = respError.statusCode;
        res.status(status_code_g).json(error_g);
      }
    }
  }
  await getDataFunc();
  //////////////////////////////////////////////////////////////////////////////////
  //Get data for employee-------------ENDS
};
//-----------------------------------------------------------------------------------------------------------
//
module.exports = {
  CreateAccessRefreshToken,
  RegenerateAccessToken,
};
