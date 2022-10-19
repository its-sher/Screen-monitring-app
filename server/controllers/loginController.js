const bcrypt = require("bcrypt");
const {
  accesstokencreation,
  refreshtokencreation,
} = require("../helpers/user-token-creation");
const {
  view_query,
  edit_query,
  error_query,
} = require("../helpers/instructions");
var moment = require("moment");
const table_name = "employees";
console.log("Inside Login controller");
//
const Login = async (req, res) => {
  // console.log("Inside Login");
  const email = req.body.email;
  //console.log(email);
  const password = req.body.password; //password is password (hashed)
  //console.log(password);
  //
  if (email && email.length > 0) {
    //check for user
    var userDataDb;
    //Get data for employee-------------STARTS
    //////////////////////////////////////////////////////////////////////////////////
    async function getDataFunc() {
      console.log("Inside getDataFunc");
      let view_payload = {
        table_name: table_name,
        query_field: "email",
        query_value: email,
        dataToGet:
          "id, first_Name, last_Name, phone, email, image, active, password",
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
              //const encodedid = encrypttheid(userId);
              //
              //removing row data packet-------------STARTS
              var resultUserDataArray = Object.values(
                JSON.parse(JSON.stringify(userDataDb))
              );
              //   console.log(resultUserDataArray);
              //removing row data packet-------------ENDS
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
                //  console.log("Inside updateUser");
                //   console.log(saveData);
                const respEdit = await edit_query(saveData);
                console.log("Back 2");
                //console.log(respEdit);
                if (respEdit.status == "success") {
                  console.log("Success User Updated");
                  //
                  //collect data req from user---starts
                  var output = resultUserDataArray[0];
                  delete output.password;
                  output["access_token"] = accesstoken;
                  output["refresh_token"] = refreshtoken;
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
              //console.log("Wrong username/password combination!");
              const Response = {
                message: "Wrong username/password combination!",
              };
              res.status(203).json(Response);
            }
          }
        );
        //Compare password ------------------------------------------------ends
      } else if (respView.status == "error") {
        //console.log("Error");
        const err = respAdd.message;
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
    await getDataFunc();
    //////////////////////////////////////////////////////////////////////////////////
    //Get data for employee-------------ENDS
  } else {
    //console.log("Invalid Details");
    const Response = {
      message: "Invalid Details",
    };
    res.status(400).json(Response);
  }
  //
};
//-------------------------------------------------------------------------------------------------------------
//
module.exports = {
  Login,
};
