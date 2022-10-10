var moment = require("moment");
const con = require("../models/db");
const bcrypt = require("bcrypt");
const { encrypttheid, decodetheid } = require("../helpers/encode-decode");
const {
  add,
  view,
  errorHelper,
  deleteHelper,
} = require("../helpers/instructions");
const {
  UserAccountVerificationCodeEmail,
  ForgotPasswordVerificationCodeEmail,
  VerificationCodeEmail,
  OtpVerified,
  UserPasswordChangedEmail,
} = require("../helpers/user");
const domainpath = process.env.REACT_APP_DOMAIN_ENDPOINT;
//
console.log("Inside User controller");
const table_name = "employees";
//
//-------------------------------------------------------------------------------------------------------------
//USER LOGIN ___________________________________________________ENDS
//
// Add a user  into database table --users-DONE--------------------------------------------------------------
const CreateUser = async (req, res) => {
  console.log("inside CreateUser");
  const dataUserTable = req.body;
  //console.log(dataUserTable);
  //
  if (
    dataUserTable.first_Name &&
    dataUserTable.first_Name.length > 0 &&
    dataUserTable.last_Name &&
    dataUserTable.last_Name.length > 0 &&
    dataUserTable.phone &&
    dataUserTable.phone > 0 &&
    dataUserTable.email &&
    dataUserTable.email.length > 0 &&
    dataUserTable.password &&
    dataUserTable.password.length > 0
  ) {
    console.log("dataUserTable");
    //   console.log(dataUserTable);
    //
    //STEP_1---Store data into table and create user and return id----------------
    //HASHING password AND STORING all data into db
    const password = dataUserTable.password;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      } else {
        //inserting new value into object key passwordHash
        dataUserTable["password"] = hash;
        //console.log(dataUserTable);
        let filteredDataUser = Object.fromEntries(
          Object.entries(dataUserTable).filter(
            ([_, v]) => v != "null" && v != "" && v != null
          )
        );
        // console.log(filteredDataUser);
        //
        //STEP_1---createUser and get data----------------STARTS
        //------------------------------------------------------
        async function createUser(saveData) {
          console.log("Inside createUser");
          //   console.log(saveData);
          //
          const respAdd = await add(table_name, saveData);
          console.log("Back 1");
          //console.log(respAdd);
          if (respAdd.status == "success") {
            console.log("Success User Created");
            const id = respAdd.id;
            const respView = await view(table_name, id);
            console.log("Back 2");
            //console.log(respView);
            if (respView.status == "success") {
              console.log("Success User Data Got");
              var finalData = respView.data;
              delete finalData.trash;
              delete finalData.password;
              const Response = {
                message: respView.status, //"User Created Successfully",
                user: respView.data,
              };
              res.status(201).json(Response);
            } else if (respView.status == "error") {
              console.log("Error");
              const err = respAdd.message;
              const respError = await errorHelper(err);
              console.log("Back 3");
              //console.log(respError);
              const Error = {
                status: "error",
                message: respError.message,
              };
              res.status(respError.statusCode).json(Error);
            }
          } else if (respAdd.status == "error") {
            console.log("Error");
            const err = respAdd.message;
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
        await createUser(filteredDataUser);
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
// ACCOUNT VERIFICATION CODE++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
//-------------------------------------------------------------------------------------------------------------
//
//Get a single user by id --DONE-------------------------------------------------------------------------------
//
const GetUserById = async (req, res) => {
  console.log("Inside GetUserById");
  //console.log(req.body.postID);
  const encryptedid = req.params.id;
  const userId = decodetheid(encryptedid);
  // console.log(userId);
  if (userId && userId > 0) {
    //
    var users_data = {};
    var users_data_resp = {};
    //
    var users_roles_data = {};
    var users_roles_data_resp = {};
    //
    //STEP-1 NOW GET Users Details from users table---++++++++++++++starts
    //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    console.log("STEP-1 STARTS");
    async function getUsersData(userID) {
      console.log("Inside getUsersData");
      return new Promise((resolve, reject) => {
        //   console.log(userID);
        //
        const sql = con.query(
          //mine
          //"SELECT id, CONCAT(first_Name, ' ', last_Name) AS fullname, roles, phone, email,  address_line1, address_line2, city, state, country, postal_code, active,  date_of_birth, gender, created_at from users WHERE id=?",
          //sir
          // "SELECT users.id, users.first_Name, users.last_Name, role.title as roles, users.phone, users.email,  users.address_line1, users.address_line2, users.city, users.state, users.country, users.postal_code, users.active, users.date_of_birth, users.gender, users.created_at, users.updated_at, users.verification_code from users LEFT JOIN users_role ON users_role.users_id = users.id LEFT JOIN role ON users_role.role = role.id WHERE users.id=?",
          //mine
          "SELECT u.id, u.first_Name, u.last_Name, u.nick_name, u.description, u.phone, u.phone_verify, u.email, u.email_verify, u.current_store, u.address_line1, u.address_line2, u.city, u.state, u.country, u.postal_code,  CONCAT('" +
            domainpath +
            "', u.image) as image, u.gender, u.date_of_birth, u.employee_id, u.active FROM users as u WHERE u.id=?", //DATE_FORMAT(u.date_of_birth, '%d-%m-%Y') AS date_of_birth, u.password,
          [userID],
          (err, response) => {
            if (!err) {
              //console.log(response);
              if (response && response.length > 0) {
                //
                //removing row data packet-------------STARTS
                var resultArray = Object.values(
                  JSON.parse(JSON.stringify(response))
                );
                // console.log(resultArray);
                //removing row data packet-------------ENDS
                //
                //Enc Order id -- STARTS
                let result1 = resultArray.map((item) => {
                  const decOrderId = item.id;
                  item.id = encrypttheid(decOrderId);
                  return item;
                });
                //Enc Order id -- ENDS
                //
                // const Response = {
                //   status: "success",
                //   responsedata: { user: result1 },
                // };
                // res.status(200).json(Response);
                users_data = result1; //data into global variable
                //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                resolve({
                  result: 1,
                });
              } else {
                console.log("STEP_1 ERROR");
                console.log("SQL ERROR - No data Got - Sql Query - Get user");
                // const Error = {
                //   status: "error",
                //   message: "No Data",
                // };
                // res.status(204).json(Response);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("STEP_1 ERROR");
              console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
              console.log("Get User sql error");
              console.log(err);
              // const Error = {
              //   status: "error",
              //   message: "Server Error",
              // };
              // res.status(400).json(Error);
              reject({
                result: 0,
              });
            }
          }
        );
        console.log(sql.sql);
        //
      }).catch((error) => console.log(error.message));
    }
    users_data_resp = await getUsersData(userId);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    // console.log(users_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //STEP-1 NOW GET Users Details from users table---++++++++++++++ends
    //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    if (
      users_data_resp &&
      users_data_resp !== undefined &&
      Object.keys(users_data_resp).length != 0 &&
      users_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY");
      console.log("STEP-2 STARTS");
      //STEP-2 NOW GET Users ROLES from users_role table---++++++++++++++starts
      //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      async function getUsersRolesData(userID) {
        console.log("Inside getUsersRolesData");
        return new Promise((resolve, reject) => {
          //   console.log(userID);
          //
          const sql = con.query(
            "SELECT ur.id as users_role_id, ur.store_type as store_type_id, st.name as store_type_name, ur.store_id, s.name as store_name, ur.role as role_id, r.title as role_name, ur.active FROM users_role as ur LEFT JOIN store_type as st ON st.id=ur.store_type LEFT JOIN stores as s ON s.id=ur.store_id LEFT JOIN role as r ON r.id=ur.role WHERE ur.trash = 0 AND ur.users_id=?",
            [userID],
            (err, response) => {
              if (!err) {
                //console.log(response);
                if (response && response.length > 0) {
                  //
                  //removing row data packet-------------STARTS
                  var resultArray = Object.values(
                    JSON.parse(JSON.stringify(response))
                  );
                  // console.log(resultArray);
                  //removing row data packet-------------ENDS
                  //
                  users_roles_data = resultArray; //data into global variable
                  //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                  resolve({
                    result: 1,
                  });
                } else {
                  console.log("STEP_2 ERROR");
                  console.log(
                    "SQL ERROR - No data Got - Sql Query - Get user ROles"
                  );
                  // const Error = {
                  //   status: "error",
                  //   message: "No Data",
                  // };
                  // res.status(204).json(Response);
                  reject({
                    result: 0,
                  });
                }
              } else {
                console.log("STEP_2 ERROR");
                console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                console.log("Get User ROles - sql error");
                console.log(err);
                // const Error = {
                //   status: "error",
                //   message: "Server Error",
                // };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            }
          );
          console.log(sql.sql);
          //
        }).catch((error) => console.log(error.message));
      }
      users_roles_data_resp = await getUsersRolesData(userId);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      // console.log(users_roles_data_resp);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      //STEP-2 NOW GET Users ROLES from users_role table---++++++++++++++ends
      //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      if (
        users_roles_data_resp &&
        users_roles_data_resp !== undefined &&
        Object.keys(users_roles_data_resp).length != 0 &&
        users_roles_data_resp.result > 0
      ) {
        console.log("STEP-2 DONE SUCCESSFULLY");
        console.log("STEP-3 STARTS");
        //DATA MATCH N COMPILE -------------------STARTS
        console.log(users_data);
        console.log(users_roles_data);
        users_data[0].roles = users_roles_data;
        console.log(users_data);
        const Response = {
          status: "success",
          responsedata: { user: users_data },
        };
        res.status(200).json(Response);
        //DATA MATCH N COMPILE -------------------ENDS
        console.log("STEP-3 ENDS");
      } else {
        console.log("STEP 2 Error");
        const Error = {
          status: "error",
          message: "Server Error",
        };
        res.status(400).json(Error);
      }
    } else {
      console.log("STEP 1 Error");
      const Error = {
        status: "error",
        message: "Server Error",
      };
      res.status(400).json(Error);
    }
    //
  } else {
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------
//
//-------------------------------------------------------------------------------------------------------------
//
// UPDATE a user  in database table --users -----------------------------------------------------------------
const UpdateUser = async (req, res) => {
  console.log("Inside UpdateUser");
  // console.log(req.body);
  //
  const data = req.body;
  //console.log(data);
  //
  var dataUserTable = {};
  //handling active---------STARTS
  if (data.hasOwnProperty("active") && (data.active == 0 || data.active == 1)) {
    console.log("Active field exists");
    dataUserTable.active = data.active;
    delete data.active;
  }
  //handling active---------_ENDS
  //
  let filteredData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v != "null" && v != "" && v != null)
  );
  //console.log(filteredData);
  const encryptedid = req.params.id;
  const userId = decodetheid(encryptedid);
  console.log(userId);
  //
  if (
    userId &&
    userId > 0 &&
    filteredData &&
    "key" in filteredData !== "undefined" &&
    filteredData.roles &&
    filteredData.roles.length > 0 &&
    filteredData.roles[0].users_role_id &&
    filteredData.roles[0].users_role_id > 0 &&
    filteredData.roles[0].role_id &&
    filteredData.roles[0].role_id > 0
  ) {
    console.log("Valid Details");
    //------------------No Password being sent now-----------------------------
    // //Password functionality STARTS-----------------------------------------
    // var hashedPassword;
    // var hash_data_resp = {};
    // //
    // if (
    //   filteredData.hasOwnProperty("password") &&
    //   filteredData.password.length > 0
    // ) {
    //   console.log("Password is sent to update");
    //   const decPass = filteredData.password;
    //   //STEP_1---hash password----------------STARTS
    //   //------------------------------------------------------
    //   async function hashPassword(password) {
    //     console.log("Inside hashPassword");
    //     return new Promise((resolve, reject) => {
    //       //   console.log(password);
    //       //
    //       bcrypt.hash(password, 10, async (err, hash) => {
    //         if (err) {
    //           console.log(err);
    //           const Error = { status: "error", message: "Server Error" };
    //           res.status(400).json(Error);
    //         } else {
    //           //inserting new value into object key passwordHash
    //           hashedPassword = hash;
    //         }
    //       });
    //     }).catch((error) => console.log(error.message));
    //   }
    //   hash_data_resp = await hashPassword(decPass);
    //   console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //   console.log(hash_data_resp);
    //   console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //   //STEP_1---hash password----------------ENDS
    //   //------------------------------------------------------
    //   //
    //   if (
    //     hash_data_resp &&
    //     hash_data_resp !== undefined &&
    //     Object.keys(hash_data_resp).length != 0 &&
    //     hash_data_resp.result > 0
    //   ) {
    //     console.log("STEP-1 DONE SUCCESSFULLY");
    //     filteredData["password"] = hashedPassword;
    //   } else {
    //     console.log("STEP 1 Error");
    //     const Error = {
    //       status: "error",
    //       message: "Server Error",
    //     };
    //     res.status(400).json(Error);
    //   }
    // } else {
    //   console.log("No Password Proceed Further");
    // }
    // //Password functionality ENDS-----------------------------------------
    //
    //ROLE table data gather --------------------_STARTS++++++++++++++++++++++++
    //--------------------------------------------------
    var dataUserRoleTable = filteredData.roles[0];
    //
    dataUserRoleTable["role"] = dataUserRoleTable.role_id;
    delete dataUserRoleTable.role_id;
    //
    const userRoleRow = dataUserRoleTable.users_role_id;
    delete dataUserRoleTable.users_role_id;
    //--------------------------------------------------
    // console.log(dataUserRoleTable);
    //--------------------------------------------------
    //ROLE table data gather --------------------ENDS+++++++++++++++++++++++++++
    //
    //User table data gather --------------------_STARTS------------------------
    //--------------------------------------------------
    //
    if (filteredData.hasOwnProperty("first_Name")) {
      dataUserTable.first_Name = filteredData.first_Name;
    }
    if (filteredData.hasOwnProperty("last_Name")) {
      dataUserTable.last_Name = filteredData.last_Name;
    }
    if (filteredData.hasOwnProperty("nick_name")) {
      dataUserTable.nick_name = filteredData.nick_name;
    }
    if (filteredData.hasOwnProperty("phone")) {
      dataUserTable.phone = filteredData.phone;
    }
    if (filteredData.hasOwnProperty("phone_verify")) {
      dataUserTable.phone_verify = filteredData.phone_verify;
    }
    if (filteredData.hasOwnProperty("email")) {
      dataUserTable.email = filteredData.email;
    }
    if (filteredData.hasOwnProperty("email_verify")) {
      dataUserTable.email_verify = filteredData.email_verify;
    }
    if (filteredData.hasOwnProperty("current_store")) {
      dataUserTable.current_store = filteredData.current_store;
    }
    if (filteredData.hasOwnProperty("verification_code")) {
      dataUserTable.verification_code = filteredData.verification_code;
    }
    if (filteredData.hasOwnProperty("address_line1")) {
      dataUserTable.address_line1 = filteredData.address_line1;
    }
    if (filteredData.hasOwnProperty("address_line2")) {
      dataUserTable.address_line2 = filteredData.address_line2;
    }
    if (filteredData.hasOwnProperty("city")) {
      dataUserTable.city = filteredData.city;
    }
    if (filteredData.hasOwnProperty("state")) {
      dataUserTable.state = filteredData.state;
    }
    if (filteredData.hasOwnProperty("country")) {
      dataUserTable.country = filteredData.country;
    }
    if (filteredData.hasOwnProperty("postal_code")) {
      dataUserTable.postal_code = filteredData.postal_code;
    }
    if (filteredData.hasOwnProperty("image")) {
      dataUserTable.image = filteredData.image;
    }
    if (filteredData.hasOwnProperty("gender")) {
      dataUserTable.gender = filteredData.gender;
    }
    if (filteredData.hasOwnProperty("date_of_birth")) {
      dataUserTable.date_of_birth = filteredData.date_of_birth;
    }
    if (filteredData.hasOwnProperty("employee_id")) {
      dataUserTable.employee_id = filteredData.employee_id;
    }
    if (filteredData.hasOwnProperty("ipaddress")) {
      dataUserTable.ipaddress = filteredData.ipaddress;
    }
    if (filteredData.hasOwnProperty("slug")) {
      dataUserTable.slug = filteredData.slug;
    }
    if (filteredData.hasOwnProperty("description")) {
      dataUserTable.description = filteredData.description;
    }
    // console.log(dataUserTable);
    //--------------------------------------------------
    //User table data gather --------------------ENDS---------------------------
    //
    var user_data_resp = {};
    var user_role_data_resp = {};
    //
    //STEP-1 Update User data ---++++++++++++++STARTS
    //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    async function updateUser(userID, saveData) {
      console.log("Inside updateUser");
      return new Promise((resolve, reject) => {
        //   console.log(userID);
        //   console.log(saveData);
        //
        const sql = con.query(
          "UPDATE users SET ? WHERE id=?",
          [saveData, userID],
          (err, result) => {
            if (!err) {
              console.log(result);
              //   console.log(result.affectedRows);
              if (result.affectedRows > 0) {
                console.log("STEP-1 --> Updated user successful");
                resolve({
                  result: 1,
                });
              } else {
                console.log("NOTHING UPDATED - case shouldn't work");
                messageERR = "Invalid Details";
                // const Error = { status: "error", message: "Invalid Details" };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("UPDATE SLQ ERRRRRRRRRRRRRRRRORRRRRRRRRR");
              console.log(err);
              messageERR = "Server Error";
              //  const Error = { status: "error", message: "Server Error" };
              //   res.status(400).json(Error);
              reject({
                result: 0,
              });
            }
          }
        );
        // console.log(sql.sql);
        //
        //
      }).catch((error) => console.log(error.message));
    }
    user_data_resp = await updateUser(userId, dataUserTable);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(user_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //STEP-1 Update User data ---++++++++++++++ENDS
    //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //
    if (
      user_data_resp &&
      user_data_resp !== undefined &&
      Object.keys(user_data_resp).length != 0 &&
      user_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY");
      console.log("STEP-2 STARTS");
      //
      //
      //STEP-2 Update User Role data ---++++++++++++++STARTS
      //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      //    console.log(dataUserRoleTable);
      async function updateUserRole(userRoleID, saveRoleData) {
        console.log("Inside updateUserRole");
        return new Promise((resolve, reject) => {
          //   console.log(userRoleID);
          //   console.log(saveRoleData);
          //
          const sql = con.query(
            "UPDATE users_role SET ? WHERE id=?",
            [saveRoleData, userRoleID],
            (err, result) => {
              if (!err) {
                console.log(result);
                //   console.log(result.affectedRows);
                if (result.affectedRows > 0) {
                  console.log("STEP-1 --> Updated users_role successful");
                  resolve({
                    result: 1,
                  });
                } else {
                  console.log("NOTHING UPDATED - case shouldn't work");
                  messageERR = "Invalid Details";
                  // const Error = { status: "error", message: "Invalid Details" };
                  // res.status(400).json(Error);
                  reject({
                    result: 0,
                  });
                }
              } else {
                console.log("UPDATE SLQ ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                console.log(err);
                messageERR = "Server Error";
                //  const Error = { status: "error", message: "Server Error" };
                //   res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            }
          );
          // console.log(sql.sql);
          //
          //
        }).catch((error) => console.log(error.message));
      }
      user_role_data_resp = await updateUserRole(
        userRoleRow,
        dataUserRoleTable
      );
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      console.log(user_role_data_resp);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      //STEP-1 Update User Role data ---++++++++++++++ENDS
      //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      if (
        user_role_data_resp &&
        user_role_data_resp !== undefined &&
        Object.keys(user_role_data_resp).length != 0 &&
        user_role_data_resp.result > 0
      ) {
        console.log("STEP-2 DONE SUCCESSFULLY");
        console.log("Everything done");
        const Response = {
          status: "success",
          message: "Updated Successfully",
        };
        res.status(200).json(Response);
        //
      } else {
        console.log("STEP 2 Error");
        const Error = {
          status: "error",
          message: "Server Error",
        };
        res.status(400).json(Error);
      }
      //
    } else {
      console.log("STEP 1 Error");
      const Error = {
        status: "error",
        message: "Server Error",
      };
      res.status(400).json(Error);
    }
  } else {
    console.log("Invalid Details - update user");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
//
// DELETE a user in database table --users--------------------------------------------------
const DeleteUser = async (req, res) => {
  console.log("Inside Delete User");
  //console.log(req);
  //
  // const encryptedid = req.params.id;
  // const userId = decodetheid(encryptedid);
  const userId = req.params.id;
  // console.log(userId);
  //
  //STEP_1---deleteUser----------------STARTS
  //------------------------------------------------------
  async function deleteUser(deleteID) {
    console.log("Inside deleteUser");
    //   console.log(deleteID);
    //
    const respDelete = await deleteHelper(table_name, deleteID);
    console.log("Back 1");
    //console.log(respDelete);
    if (respDelete.status == "success") {
      console.log("Success User Deleted");
      const Response = {
        status: "success",
        message: "User Deleted Successfully",
      };
      res.status(201).json(Response);
    } else if (respDelete.status == "error") {
      console.log("Error");
      const err = respDelete.message;
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
  await deleteUser(userId);
  //STEP_1---deleteUser----------------ENDS
  //------------------------------------------------------
  //
};
//-----------------------------------------------------------------------------------------------------------------
//
const AccountVerificationCode = async (req, res) => {
  console.log("inside AccountVerificationCode send email");
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
          let resp = await UserAccountVerificationCodeEmail(user_data_comp);
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
const VerificationCode = async (req, res) => {
  console.log("inside VerificationCode");
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
          let resp = await VerificationCodeEmail(user_data_comp);
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
// Add a user  into database table --users-DONE--------------------------------------------------------------
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
  CreateUser,
  GetUserById,
  UpdateUser,
  DeleteUser,
  //
  AccountVerificationCode,
  VerificationCode,
  ForgotPassword,
  //
  VerifyOtp,
  PasswordUpdate,
};
