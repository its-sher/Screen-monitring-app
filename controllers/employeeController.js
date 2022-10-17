var moment = require("moment");
const con = require("../models/db");
const bcrypt = require("bcrypt");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
const {
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("../helpers/instructions");
const {
  UserAccountVerificationCodeEmail,
  ForgotPasswordVerificationCodeEmail,
  VerificationCodeEmail,
  OtpVerified,
  UserPasswordChangedEmail,
} = require("../helpers/employee");
const { apikey } = require("../helpers/user-token-creation");
const domainpath = process.env.REACT_APP_DOMAIN_ENDPOINT;
//
console.log("Inside Employee Controller");
const table_name = "employees";
//
//-------------------------------------------------------------------------------------------------------------
//
// CreateEmployee ----------------------------------------------------------------
const CreateEmployee = async (req, res) => {
  console.log("inside CreateEmployee");
  const dataEmployeeTable = req.body;
  //console.log(dataEmployeeTable);
  //
  if (
    dataEmployeeTable.first_Name &&
    dataEmployeeTable.first_Name.length > 0 &&
    dataEmployeeTable.last_Name &&
    dataEmployeeTable.last_Name.length > 0 &&
    dataEmployeeTable.phone &&
    dataEmployeeTable.phone > 0 &&
    dataEmployeeTable.email &&
    dataEmployeeTable.email.length > 0 &&
    dataEmployeeTable.password &&
    dataEmployeeTable.password.length > 0
  ) {
    console.log("dataEmployeeTable");
    //   console.log(dataEmployeeTable);
    //
    //STEP_1---Store data into table to create employee and return id----------------
    //HASHING password AND STORING all data into db
    const password = dataEmployeeTable.password;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      } else {
        //inserting new value into object key passwordHash
        dataEmployeeTable["password"] = hash;
        //console.log(dataEmployeeTable);
        let filteredData = Object.fromEntries(
          Object.entries(dataEmployeeTable).filter(
            ([_, v]) => v != "null" && v != "" && v != null
          )
        );
        // console.log(filteredData);
        //
        //generate apikey-------------------------------------Starts
        const randomStr = dataEmployeeTable.last_Name.concat(
          dataEmployeeTable.email
        );
        //console.log(randomStr);
        const api_key = await apikey(randomStr);
        //console.log("BCK");
        //console.log(api_key);
        filteredData["api_key"] = api_key;
        //generate apikey-------------------------------------Ends
        //
        //STEP_1---CreateEmployee and get data----------------STARTS
        //------------------------------------------------------
        async function createEmployee(saveData) {
          console.log("Inside createEmployee");
          //   console.log(saveData);
          //
          let add_payload = {
            table_name: table_name,
            dataToSave: saveData,
          };
          //console.log(add_payload);
          const respAdd = await add_query(add_payload);
          console.log("Back 1");
          //console.log(respAdd);
          if (respAdd.status == "success") {
            console.log("Success Employee Created");
            const id = respAdd.id;
            //
            //Get data for created employee-------------STARTS
            let view_payload = {
              table_name: table_name,
              dataToGet:
                "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, employee_id, active, description",
              query_field: "id",
              query_value: id,
            };
            const respView = await view_query(view_payload);
            console.log("Back 2");
            //console.log(respView);
            if (respView.status == "success") {
              console.log("Success Employee Data Got");
              var finalData = respView.data;
              delete finalData.trash;
              delete finalData.password;
              const Response = {
                message: respView.status, //"Employee Created Successfully",
                responsedata: { user: respView.data },
              };
              res.status(201).json(Response);
            } else if (respView.status == "error") {
              console.log("Error");
              const err = respAdd.message;
              const respError = await error_query(err);
              console.log("Back 2-E");
              //console.log(respError);
              const Error = {
                status: "error",
                message: respError.message,
              };
              res.status(respError.statusCode).json(Error);
            }
            //Get data for created employee-------------ENDS
            //
          } else if (respAdd.status == "error") {
            console.log("Error");
            const err = respAdd.message;
            const respError = await error_query(err);
            console.log("Back 1-E");
            //  console.log(respError);
            const Error = {
              status: "error",
              message: respError.message,
            };
            res.status(respError.statusCode).json(Error);
          }
        }
        await createEmployee(filteredData);
        //STEP_1---createUser and get data----------------ENDS
        //------------------------------------------------------
        //
      }
    });
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
//
//GetEmployees ---------------------------------------------------------------------------------
const GetEmployees = async (req, res) => {
  console.log("inside GetEmployees");
  //
  const employeeId = req.params.id;
  // console.log(employeeId);
  // console.log(typeof employeeId); //string
  //
  async function getDataFunc(configID) {
    console.log("Inside getDataFunc");
    //
    var allData = 0;
    var idData = 0;
    var view_payload;
    configID == "all" ? (allData = 1) : (idData = 1);
    //
    if (allData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, employee_id, active, description",
      };
    } else if (idData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, employee_id, active, description",
        query_field: "id",
        query_value: configID,
      };
    }
    // console.log(view_payload);
    //
    const respView = await view_query(view_payload);
    console.log("Back 1");
    //console.log(respView);
    if (respView.status == "success") {
      console.log("Success employee Data Got");
      const Response = {
        message: respView.status,
        responsedata: { employee: respView.data },
      };
      res.status(200).json(Response);
    } else if (respView.status == "error") {
      console.log("Error");
      const err = respView.message;
      const respError = await error_query(err);
      console.log("Back 1-E");
      console.log(respError);
      const Error = {
        status: "error",
        message: respError.message,
      };
      res.status(respError.statusCode).json(Error);
    }
  }
  await getDataFunc(employeeId);
  //
};
//-----------------------------------------------------------------------------------------------------------
//
// UpdateEmployee -----------------------------------------------------------------
const UpdateEmployee = async (req, res) => {
  console.log("Inside UpdateEmployee");
  const data = req.body;
  // console.log(data);
  //
  const employeeId = req.params.id;
  //console.log(employeeId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    employeeId &&
    employeeId > 0
  ) {
    console.log("Valid Details");
    //
    //STEP_1---------- UpdateEmployee ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: employeeId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        console.log("Success Employee Data Updated");
        //
        //STEP_2---Get Data for Employee----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const view_payload = {
            table_name: table_name,
            dataToGet:
              "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, employee_id, active, description",
            query_field: "id",
            query_value: employeeId,
          };
          // console.log(view_payload);
          const respView = await view_query(view_payload);
          console.log("Back 2");
          //console.log(respView);
          if (respView.status == "success") {
            console.log("Success employee Data Got");
            const Response = {
              message: respView.status,
              responsedata: { employee: respView.data },
            };
            res.status(200).json(Response);
          } else if (respView.status == "error") {
            console.log("Error");
            const err = respView.message;
            const respError = await error_query(err);
            console.log("Back 2-E");
            console.log(respError);
            const Error = {
              status: "error",
              message: respError.message,
            };
            res.status(respError.statusCode).json(Error);
          }
        }
        await getDataFunc();
        //STEP_2---Get Data for Employee----------------ENDS
        //////////////////////////////////////////////////////
        //
      } else if (respEdit.status == "error") {
        console.log("Error");
        const err = respEdit.message;
        const respError = await error_query(err);
        console.log("Back 1-E");
        //  console.log(respError);
        const Error = {
          status: "error",
          message: respError.message,
        };
        res.status(respError.statusCode).json(Error);
      }
      //
      //STEP_1---------- UpdateEmployee ----------------ENDS
      //------------------------------------------------------
      //
    }
    await updateDataFunc();
    //////////////////////////////////////////////////////////////////////////////////
    //
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
//
// DeleteEmployee (Trash)--------------------------------------------------
const DeleteEmployee = async (req, res) => {
  console.log("Inside DeleteEmployee");
  const employeeId = req.params.id;
  // console.log(employeeId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside deleteEmployee");
    //   console.log(deleteID);
    //----------------------1----------------------------------------------
    // let update_payload = {
    //   table_name: table_name,
    //   query_field: "id",
    //   query_value: deleteID,
    // };
    //console.log(update_payload);
    // const respDelete = await deleteHelper(update_payload);
    //----------------------1----------------------------------------------
    //
    //-------------------2--------------------------------------------------
    let delete_payload = {
      table_name: table_name,
      query_field: "id",
      query_value: deleteID,
      dataToSave: {
        active: 0,
        trash: 1,
      },
    };
    //console.log(delete_payload);
    const respDelete = await trash_query(delete_payload);
    console.log("Back 1");
    //console.log(respDelete);
    if (respDelete.status == "success") {
      console.log("Success Employee Trash Deleted");
      const Response = {
        status: "success",
        message: "Employee Deleted Successfully",
      };
      res.status(201).json(Response);
    } else if (respDelete.status == "error") {
      console.log("Error");
      const err = respDelete.message;
      const respError = await error_query(err);
      console.log("Back 1-E");
      //  console.log(respError);
      const Error = {
        status: "error",
        message: respError.message,
      };
      res.status(respError.statusCode).json(Error);
    }
    //-------------------2--------------------------------------------------
  }
  await deleteConfigFunc(employeeId);
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//
//
//
//
//
// ForgotPassword++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const ForgotPassword = async (req, res) => {
  console.log("inside ForgotPassword");
  //console.log(req);
  //
  const encryptedid = req.params.id;
  const userIdFP = decodetheid(encryptedid); //decrypted id now
  // console.log(userIdFP);
  //
  con.query(
    //"SELECT id, first_Name, last_Name, phone, email FROM users WHERE id=?",
    "SELECT * from users WHERE id=?",
    [userIdFP],
    async (err, response) => {
      if (!err) {
        if (response && response.length > 0) {
          var user_data_comp;
          //array is defined and is not empty
          //console.log(response);
          //
          //removing row data packet-------------STARTS
          var resultArray = Object.values(JSON.parse(JSON.stringify(response)));
          //  console.log(resultArray);
          //removing row data packet-------------ENDS
          //
          user_data_comp = resultArray;
          let resp = await ForgotPasswordVerificationCodeEmail(user_data_comp);
          console.log(resp);
          if (resp.status == "success") {
            console.log("BACK");
            console.log("Email Sent Successfully");
            res.status(200).json(resp);
          } else if (resp.status == "error") {
            console.log("BACK");
            console.log("Email Sending Failed");
            res.status(400).json(resp);
          }
        } else {
          console.log("ERROR");
          console.log("SQL ERROR - No data Got - Sql Query - User");
          const Error = {
            status: "error",
            message: "No Data",
          };
          res.status(204).json(Response);
        }

        //send email starts-----------------------------------------
        // async function check() {
        //   // console.log("before waiting");
        //   //await testAsync();
        //   let resp = await sendemail(response);
        //   //console.log(resp);
        //   // console.log("After waiting");
        // }
        // check();
        //send email ends -----------------------------------------
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//VerifyOtp----------------------------------------------------_STARTS
const VerifyOtp = async (req, res) => {
  console.log("inside VerifyOtp");
  //console.log(req.body);
  const rec_verification_code = req.body.verification_code;
  //console.log(rec_verification_code);
  //
  const entity = req.body.entity;
  //console.log(entity);
  //
  //
  const encryptedid = req.params.id;
  const userIdFP = decodetheid(encryptedid); //decrypted id now
  // console.log(userIdFP);
  //
  if (
    rec_verification_code &&
    rec_verification_code.length > 0 &&
    userIdFP &&
    userIdFP > 0 &&
    entity &&
    entity.length > 0
  ) {
    console.log("Valid User id and verification code received");
    con.query(
      //"SELECT id, first_Name, last_Name, phone, email FROM users WHERE id=?",
      "SELECT * from users WHERE id=?",
      [userIdFP],
      async (err, response) => {
        if (!err) {
          if (response && response.length > 0) {
            var user_data_comp;
            //array is defined and is not empty
            //console.log(response);
            //
            //removing row data packet-------------STARTS
            var resultArray = Object.values(
              JSON.parse(JSON.stringify(response))
            );
            //  console.log(resultArray);
            //removing row data packet-------------ENDS
            //
            user_data_comp = resultArray;
            //console.log(user_data_comp);
            const db_verification_code = user_data_comp[0].verification_code;
            //console.log(db_verification_code);

            //Step-1--------Chk Otp Expired or Not-------starts
            const uptimevcodesavedindb = user_data_comp[0].updated_at; //TIME wn VCODE was saved in db

            var dateThen = new moment(uptimevcodesavedindb);
            var dateNow = new moment(); //present time
            var difference = moment.duration(dateNow.diff(dateThen));
            //console.log(difference._milliseconds);
            var diffinmilli = difference._milliseconds;
            if (diffinmilli > 300000) {
              console.log("Otp Expired");
              const Error = {
                status: "error",
                message: "OTP Expired!!. Resend New OTP",
              };
              res.status(400).json(Error);
            } else {
              console.log("Otp time Remaining");
              //
              //Step-2++++++++++++++++++++++++++++++++++++++++starts
              //Compare 2 codes===============================STARTS
              //
              if (
                rec_verification_code &&
                rec_verification_code.length > 0 &&
                db_verification_code &&
                db_verification_code.length > 0
              ) {
                console.log("Valid -- BOTH -- Codes");
                //console.log(rec_verification_code);
                //console.log(typeof rec_verification_code);
                //console.log(db_verification_code);
                //console.log(typeof db_verification_code);
                if (rec_verification_code === db_verification_code) {
                  console.log("Matching strings of OTP");
                  //
                  //send email as per entity--starts
                  OtpVerified(userIdFP, entity);
                  //send email as per entity--starts
                  //
                  const Response = {
                    //customer: response,
                    message: "Otp Verification Successful",
                  };
                  res.status(201).json(Response);
                  //
                } else {
                  console.log("Strings do not match");
                  const Error = {
                    status: "error",
                    message: "OTP Mismatch!!. Enter Correct OTP",
                  };
                  res.status(203).json(Error);
                }
              } else {
                console.log("Error in getting both codes");
                const Error = { status: "error", message: "Server Error" };
                res.status(400).json(Error);
              }
              //
              //Compare 2 codes===============================ENDS
              //Step-2++++++++++++++++++++++++++++++++++++++++ends
              //
            }
            //Step-1--------Chk Otp Expired or Not-------ends
            //
          } else {
            console.log("ERROR");
            console.log("SQL ERROR - No data Got - Sql Query - User");
            const Error = {
              status: "error",
              message: "No Data",
            };
            res.status(204).json(Response);
          }
        } else {
          console.log(err);
          const Error = { status: "error", message: "Server Error" };
          res.status(400).json(Error);
        }
      }
    );
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Server Error" };
    res.status(400).json(Error);
  }
};
//VerifyOtp----------------------------------------------------ENDS
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//-----------------------------------------------------------------------------------------------------------------
//
// PasswordUpdate-----DONE--------------------------------------------------------------
const PasswordUpdate = async (req, res) => {
  console.log("inside PasswordUpdate");
  //
  const encryptedid = req.params.id;
  // console.log(encryptedid);
  const password = req.body.password;
  // console.log(password);
  const old_password = req.body.old_password;
  // console.log(old_password);
  //
  if (encryptedid && encryptedid.length > 0) {
    //
    const user_id = decodetheid(encryptedid); //decrypted id now
    //
    if (user_id && user_id > 0) {
      //
      var condition = 0;
      //CASES-1 --Both Old & New Password
      if (
        password &&
        password.length > 0 &&
        old_password &&
        old_password.length > 0
      ) {
        console.log("Both Old & New Password");
        condition = 1;
      }
      //CASES-2 --Only New Password
      else if (password && password.length > 0) {
        console.log("Only New Password");
        condition = 2;
      } else {
        console.log("Invalid Details");
        const Error = { status: "error", message: "Invalid Details" };
        res.status(400).json(Error);
      }
      //------------------------------------------------------------------------------------------
      if (condition == 1) {
        //console.log("Both Old & New Password");
        const resp = await checkOldPassword(password, old_password);
      } else if (condition == 2) {
        // console.log("Only New Password");
        updateNewPassword(password);
      }
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //FUCNTION-2 Update new password --------starts++++++++++++++++++++++++++++
      function updateNewPassword(password) {
        var data = {};
        //HASHING password AND STORING all data into db
        bcrypt.hash(password, 10, (err, hash) => {
          if (!err) {
            //inserting new value into object key passwordHash
            data["password"] = hash;
            //console.log(data);

            //var sql = con.query(
            con.query(
              "UPDATE users SET ? WHERE id=?",
              [data, user_id],
              (err, result) => {
                //console.log(err);
                if (!err) {
                  if (result && result.affectedRows > 0) {
                    console.log("Password Updated Successfully");
                    //res.json("Password Updated Successfully");
                    // console.log(response);
                    UserPasswordChangedEmail(user_id); //email
                    const Response = {
                      //customer: response,
                      message: "Password Updated Successfully",
                    };
                    res.status(201).json(Response);
                  } else {
                    console.log("NOTHING UPDATED");
                    const Error = {
                      status: "error",
                      message: "Invalid Details",
                    };
                    res.status(400).json(Error);
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
            //console.log(sql.sql);
          } else {
            console.log(err);
            const Error = {
              status: "error",
              message: "Server Error",
            };
            res.status(400).json(Error);
          }
        });
      }
      //FUCNTION-2 Update new password --------ends++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      //
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //FUCNTION-1 Update new password --------starts++++++++++++++++++++++++++++
      async function checkOldPassword(password, old_password) {
        //check old password--------------------------STARTS------------------------------
        con.query(
          "SELECT id, password FROM users WHERE id=?",
          [user_id],
          async (err, result) => {
            //console.log(result);
            if (!err) {
              if (result && result.length > 0) {
                //console.log("user exists");
                //console.log(result);
                //console.log(result[0].password);
                bcrypt.compare(
                  old_password,
                  result[0].password,
                  (error, response) => {
                    //console.log(response);
                    if (response == true) {
                      //console.log(response); //true
                      console.log("Old Password Correct");
                      updateNewPassword(password);
                      //
                    } else {
                      const Error = {
                        status: "error",
                        message: "Old Password Incorrect",
                      };
                      res.status(400).json(Error);
                    }
                  }
                );
              } else {
                console.log(
                  "CASE shouldnot work-->password not found/customer dont exists"
                );
                const Error = {
                  status: "error",
                  message: "Server Error",
                };
                res.status(400).json(Error);
              }
            } else {
              console.log(err);
              const Error = { status: "error", message: "Server Error" };
              res.status(400).json(Error);
            }
          }
        );
        //check old password--------------------------ENDS---------------------------------
      }
      //FUCNTION-1 Update new password --------starts++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    } else {
      console.log("Invalid id");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
  } else {
    console.log("Invalid id");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//
module.exports = {
  CreateEmployee, //done
  GetEmployees, //done
  UpdateEmployee,
  DeleteEmployee, //done
  //
  ForgotPassword,
  VerifyOtp,
  PasswordUpdate,
};
