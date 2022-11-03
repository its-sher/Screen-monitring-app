const Role = require("../models/role");
//
/*-----------Roles------------------------------starts here--------------------*/
exports.Roles = async (req, res) => {
  var roleId;
  let role_data = [];
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      role_data = await fetch_single_role(roleId);
      //console.log(role_data);
      g_response["status"] = "success";
      g_response["responsedata"] = { role: role_data };
      g_status_code = 200;
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  } else if (req.params && Object.keys(req.params).length == 0) {
    try {
      role_data = await fetch_roles(roleId);
      //console.log(role_data);
      g_response["status"] = "success";
      g_response["responsedata"] = { roles: role_data };
      g_status_code = 200;
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  } else {
    console.log("Invalid url params");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
/*-----------Roles------------------------------ends here--------------------*/
//
/*-----------RolesByParent---------------------------starts here--------------------*/
exports.RolesByParent = async (req, res) => {
  var roleId;
  let role_data = [];
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      role_data = await fetch_roles_by_parent(roleId);
      //console.log(role_data);
      g_response["status"] = "success";
      g_response["responsedata"] = { roles: role_data };
      g_status_code = 200;
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  }
};
/*-----------RolesByParent---------------------------ends here--------------------*/
//
//
/*-----------TrashRole---------------------------starts here--------------------*/
exports.Trash = async (req, res) => {
  var roleId;
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      const role_data = await trash_role(roleId);
      //console.log(role_data);
      g_response["status"] = "success";
      g_response["message"] = role_data;
      g_status_code = 201;
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  }
};
/*-----------TrashRole---------------------------ends here--------------------*/
//
//
/*-----------Delete---------------------------starts here--------------------*/
exports.Delete = async (req, res) => {
  var roleId;
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      const role_data = await delete_role(roleId);
      //console.log(role_data);
      g_response["status"] = "success";
      g_response["message"] = role_data;
      g_status_code = 201;
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  }
};
/*-----------Delete---------------------------ends here--------------------*/
//
//----FUNCTIONS----------------------------------------------------------STARTS
const fetch_single_role = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.fetchRole(roleId, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const fetch_roles = () => {
  return new Promise((resolve, reject) => {
    Role.fetchRoles((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const fetch_roles_by_parent = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.fetchRolesByParent(roleId, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const trash_role = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.trash(roleId, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const delete_role = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.delete(roleId, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
//----FUNCTIONS----------------------------------------------------------ENDS
//
// Add a role  into database table --role-DONE--------------------------------------------------------------
const CreateRole = async (req, res) => {
  //1--title, parent_role, store_type, store_id, description
  //2--role_id, module_id, access
  console.log("Create Role, Permissions");
  const data = req.body;
  // console.log(data);
  let filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v != "null" && v != "" && v != null && v != null
    )
  );
  // console.log(filteredData);
  if (
    filteredData.title &&
    filteredData.title.length &&
    filteredData.MODULES &&
    filteredData.MODULES !== undefined &&
    Object.keys(filteredData.MODULES).length != 0
  ) {
    console.log("Valid Details");
    //
    var roleTableData = {};
    var rolePermissionTableData = {};
    //
    var role_data = {};
    var role_data_resp = {};
    //
    var modules_data = {};
    var modules_data_resp = {};
    //
    var role_permission_data_resp = {};
    //
    //Data for role table--------------_STARTS
    //--------------handling title-----------------------starts
    //
    if (filteredData.hasOwnProperty("store_id") && filteredData.store_id > 0) {
      roleTableData.store_id = filteredData.store_id;
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      const tempTitile1 = filteredData.title; //super_admin
      const prefix = filteredData.store_id + "_"; //69
      const temp2 = prefix.concat(tempTitile1); // 69_super_admin
      roleTableData["title"] = temp2;
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
    } else {
      roleTableData["title"] = filteredData.title;
    }
    //
    //--------------handling title-----------------------ends
    if (filteredData.hasOwnProperty("parent_role")) {
      roleTableData.parent_role = filteredData.parent_role;
    }
    if (filteredData.hasOwnProperty("store_type")) {
      roleTableData.store_type = filteredData.store_type;
    }

    if (filteredData.hasOwnProperty("description")) {
      roleTableData.description = filteredData.description;
    }
    //  console.log(roleTableData);
    //
    //Data for role table--------------ENDS
    //
    //
    //Data for role_permission table--------------_STARTS
    rolePermissionTableData = filteredData.MODULES;
    //  console.log(rolePermissionTableData);
    //Data for role_permission table--------------ENDS
    //
    //STEP_1---createRole and get data----------------STARTS
    //------------------------------------------------------
    async function createRole(saveData) {
      console.log("Inside createRole");
      return new Promise((resolve, reject) => {
        //   console.log(saveData);
        //
        const sql = con.query(
          "INSERT INTO role SET ?",
          [saveData],
          (err, result) => {
            if (!err) {
              if (result && result.affectedRows > 0) {
                console.log("Insert Success");
                //console.log(result);
                const LastID = result.insertId;
                // console.log(LastID);
                const sql1 = con.query(
                  "SELECT id from role WHERE id=?",
                  [LastID],
                  (err, response) => {
                    if (!err) {
                      if (response && response.length > 0) {
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
                        role_data = resultArray[0].id;
                        //data into global variable
                        //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                        resolve({
                          result: 1,
                        });
                      } else {
                        console.log("STEP_1 ERROR");
                        console.log(
                          "SQL ERROR - No data Got - Sql Query - Role"
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
                      console.log("STEP_1 ERROR");
                      console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                      console.log("Get Role sql error");
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
                console.log(sql1.sql);
              } else {
                console.log("STEP_1 ERROR");
                console.log("Nothing Inserted");
                console.log("SQL ERROR - insert Query - Role");
                // console.log(err);
                // const Error = {
                //   status: "error",
                //   message: "Server Error",
                // };
                // res.status(400).json(Error);
                reject({
                  result: 0,
                });
              }
            } else {
              console.log("STEP_1 ERROR");
              console.log("Insert Error SQL Role");
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
      }).catch((error) => console.log(error.message));
    }
    role_data_resp = await createRole(roleTableData);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    console.log(role_data_resp);
    console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
    //STEP_1---createRole and get data----------------ENDS
    //------------------------------------------------------
    //
    //for testing----------------------------------starts
    //   role_data_resp = { result: 1 };
    // role_data = 18;
    //for testing----------------------------------ends
    //
    if (
      role_data_resp &&
      role_data_resp !== undefined &&
      Object.keys(role_data_resp).length != 0 &&
      role_data_resp.result > 0
    ) {
      console.log("STEP-1 DONE SUCCESSFULLY");
      console.log("STEP-2 STARTS");
      //
      //STEP-2 NOW GET ALL MODULES MADE BY SUPER-ADMIN---++++++++++++++starts
      //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      async function getModulesData() {
        console.log("Inside getModulesData");
        return new Promise((resolve, reject) => {
          //   console.log(saveData);
          //
          const sql1 = con.query(
            "SELECT id, name FROM modules WHERE active = 1 AND trash = 0", //, parent_id, slug, active, trash, created_at, updated_at
            (err, response) => {
              if (!err) {
                if (response && response.length > 0) {
                  //array is defined and is not empty
                  //console.log(response);
                  //
                  //removing row data packet-------------STARTS
                  var resultArray = Object.values(
                    JSON.parse(JSON.stringify(response))
                  );
                  // console.log(resultArray);
                  //removing row data packet-------------ENDS
                  //
                  // const Response = {
                  //   status: "success",
                  //   responsedata: { modules: resultArray },
                  // };
                  // res.status(200).json(Response);
                  modules_data = resultArray; //data into global variable
                  //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                  resolve({
                    result: 1,
                  });
                } else {
                  console.log("STEP_5 ERROR");
                  console.log("SQL ERROR - No data Got - Sql Query - Modules");
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
                console.log("STEP_5 ERROR");
                console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                console.log("Get Modules sql error");
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
          console.log(sql1.sql);
          //
        }).catch((error) => console.log(error.message));
      }
      modules_data_resp = await getModulesData();
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      // console.log(modules_data_resp);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      //STEP-2 NOW GET ALL MODULES MADE BY SUPER-ADMIN---++++++++++++++ends
      //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      if (
        modules_data_resp &&
        modules_data_resp !== undefined &&
        Object.keys(modules_data_resp).length != 0 &&
        modules_data_resp.result > 0
      ) {
        console.log("STEP-2 DONE SUCCESSFULLY");
        console.log("Step-3 starts");
        //  console.log(role_data); //role_id,
        //  console.log(rolePermissionTableData);
        //  console.log(modules_data); //all modules
        //
        //DATA MATCH N COMPILE -------------------STARTS
        var result = Object.entries(rolePermissionTableData);
        //   console.log(result);
        //
        var arrRolePermissionInsert = [];
        modules_data.map((item) => {
          result.map((item1) => {
            if (item1[0] == item.name) {
              arrRolePermissionInsert.push([
                role_data, //role_id,
                item.id, // module_id,
                item1[1],
              ]);
              //role_id, module_id, access
            }
          });
        });
        //  console.log(arrRolePermissionInsert);
        //DATA MATCH N COMPILE -------------------ENDS
        if (arrRolePermissionInsert.length > 0) {
          console.log(
            "Array data there to save modules, access in role_permission"
          );
          //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          const saveRolePermission = async (dataTosave) => {
            console.log("Inside saveRolePermission");
            return new Promise((resolve, reject) => {
              //LOOP - for inserting - STARTS-&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
              //
              const sql = con.query(
                "INSERT INTO role_permission (role_id, module_id, access) VALUES ?",
                [dataTosave],
                (err, result) => {
                  if (!err) {
                    if (result && result.affectedRows > 0) {
                      console.log("Step-3 -- Insert Success");
                      resolve({ result: 1 });
                    } else {
                      console.log("STEP_3 ERROR");
                      console.log("Nothing Inserted");
                      console.log("SQL ERROR - insert Query - role_permission");
                      // const Error = {
                      //   status: "error",
                      //   message: "Server Error",
                      // };
                      // res.status(400).json(Error);
                      reject({
                        result: 0,
                      });
                    }
                  } else {
                    console.log("STEP_3 ERROR");
                    console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                    console.log("Insert role_permission sql error");
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
              //LOOP - for inserting - ENDS-&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
            }).catch((error) => console.log(error.message));
          };
          role_permission_data_resp = await saveRolePermission(
            arrRolePermissionInsert
          );
          console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
          // console.log(
          //   role_permission_data_resp
          // );
          console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
          //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
          //
          if (
            role_permission_data_resp &&
            role_permission_data_resp !== undefined &&
            Object.keys(role_permission_data_resp).length != 0 &&
            role_permission_data_resp.result > 0
          ) {
            console.log("Everything done now JUST return data");
            //
            const Response = {
              status: "success",
              message: "Created Successfully",
            };
            res.status(200).json(Response);
          } else {
            console.log("STEP 3 Error");
            const Error = {
              status: "error",
              message: "Server Error",
            };
            res.status(400).json(Error);
          }
          //
        } else {
          console.log("STEP 3 Error");
          console.log(
            "No Array Data to save modules, access in role_permission"
          );
          const Error = {
            status: "error",
            message: "Server Error",
          };
          res.status(400).json(Error);
        }
      } else {
        console.log("Step 2 Process Error");
        const Error = {
          status: "error",
          message: "Server Error",
        };
        res.status(400).json(Error);
      }
      //
    } else {
      console.log("Step 1 Process Error");
      const Error = {
        status: "error",
        message: "Server Error",
      };
      res.status(400).json(Error);
    }
  } else {
    console.log("Invalid Details to add role");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
// UPDATE a role  in database table --role-----------------------------------------------
const UpdateRoleById = async (req, res) => {
  console.log("Inside UpdateRoleById");
  //console.log(req.body);
  //
  const data = req.body;
  //console.log(data);
  //
  const encryptedRoleId = req.params.id;
  const roleId = decodetheid(encryptedRoleId);
  //console.log(roleId);
  //

  if (roleId && roleId > 0 && data && "key" in data !== "undefined") {
    console.log("Valid Details");
    //
    var role_data = {};
    var role_permissions_data = {};
    let filteredData = data;
    // if (
    //   data.hasOwnProperty("active") &&
    //   (data.active == 0 || data.active == 1)
    // ) {
    //   role_data.active = data.active;
    // }
    //
    // let filteredData = Object.fromEntries(
    //   Object.entries(data).filter(
    //     ([_, v]) => v != "null" && v != "" && v != null
    //   )
    // );
    //  console.log(filteredData);
    //
    if (
      filteredData &&
      filteredData !== undefined &&
      Object.keys(filteredData).length != 0
    ) {
      //
      if (
        filteredData.hasOwnProperty("title") &&
        filteredData.title.length > 0
      ) {
        role_data.title = filteredData.title;
      }
      if (
        filteredData.hasOwnProperty("description")
        // &&
        // filteredData.description.length > 0
      ) {
        role_data.description = filteredData.description;
      }
      if (
        filteredData.hasOwnProperty("parent_role") &&
        (filteredData.parent_role > 0 || filteredData.parent_role == null)
      ) {
        role_data.parent_role = filteredData.parent_role;
      }
      if (
        filteredData.hasOwnProperty("store_type") &&
        filteredData.store_type > 0
      ) {
        role_data.store_type = filteredData.store_type;
      }
      if (
        filteredData.hasOwnProperty("store_id") &&
        filteredData.store_id > 0
      ) {
        role_data.store_id = filteredData.store_id;
      }
      if (filteredData.hasOwnProperty("active")) {
        role_data.active = filteredData.active;
      }
      if (filteredData.hasOwnProperty("MODULES")) {
        role_permissions_data = filteredData.MODULES;
      }

      console.log(role_data);
      console.log(role_permissions_data);
      //
      //
      //STEP-1 Update Store Type data ---++++++++++++++STARTS
      //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      var messageERR;
      var role_update_data_resp = {};
      var delete_role_permissions_data_resp = {};
      var modules_data = {};
      var modules_data_resp = {};
      var save_role_permissions_data_resp = {};
      //
      async function updateRoleData(saveData, roleID) {
        console.log("Inside updateRoleData");
        return new Promise((resolve, reject) => {
          //   console.log(roleID);
          //
          const sql = con.query(
            "UPDATE role SET ? WHERE id=?",
            [saveData, roleID],
            (err, result) => {
              if (!err) {
                //   console.log(result);
                //   console.log(result.affectedRows);
                if (result.affectedRows > 0) {
                  console.log("STEP-1 --> Updated role successful");
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
      role_update_data_resp = await updateRoleData(role_data, roleId);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      console.log(role_update_data_resp);
      console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
      //STEP-1 Update Store Type data ---++++++++++++++ENDS
      //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      //
      if (
        role_update_data_resp &&
        role_update_data_resp !== undefined &&
        Object.keys(role_update_data_resp).length != 0 &&
        role_update_data_resp.result > 0
      ) {
        console.log("STEP-1 DONE SUCCESSFULLY");
        console.log("STEP-2 STARTS");
        //
        if (
          filteredData.hasOwnProperty("MODULES") &&
          filteredData.MODULES &&
          filteredData.MODULES !== undefined &&
          Object.keys(filteredData.MODULES).length != 0
        ) {
          console.log("ROLE, PERMISSIONS EXISTS");

          //////////////////////////////STEP-2///////////////////////
          //DELETE all role_permissions of this role--starts
          //
          async function deleteRolePermissions(roleID) {
            console.log("Inside deleteRolePermissions");

            return new Promise((resolve, reject) => {
              //   console.log(roleID);
              //
              const sql1 = con.query(
                "DELETE FROM role_permission WHERE role_id=?",
                [roleID],
                (err, response) => {
                  // console.log(response);
                  if (typeof response === "undefined") {
                    messageERR = "Not Permitted to Delete";
                    // const Response = {
                    //   data: { message: "Not Permitted to Delete" },
                    // };
                    // res.status(204).json(Response);
                    reject({
                      result: 0,
                    });
                  } else if (!err) {
                    if (response && response.affectedRows > 0) {
                      console.log(
                        "Step-2 role permissions deleted successfully"
                      );
                      resolve({
                        result: 1,
                      });
                    } else {
                      console.log("STEP_2 ERROR");
                      console.log("SQL ERROR - Nothing deleted");
                      messageERR = "Server Error";
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
                    console.log("Delete role permissions sql error");
                    console.log(err);
                    messageERR = "Server Error";
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
              console.log(sql1.sql);
              //
            }).catch((error) => console.log(error.message));
          }
          delete_role_permissions_data_resp = await deleteRolePermissions(
            roleId
          );
          console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
          // console.log(delete_role_permissions_data_resp);
          console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
          //
          //DELETE all role_permissions of this role--ends
          //////////////////////////////STEP-2///////////////////////
          //
          if (
            delete_role_permissions_data_resp &&
            delete_role_permissions_data_resp !== undefined &&
            Object.keys(delete_role_permissions_data_resp).length != 0 &&
            delete_role_permissions_data_resp.result > 0
          ) {
            console.log("STEP-2 DONE SUCCESSFULLY");
            console.log("STEP-3 STARTS");
            //
            //STEP-3 NOW GET ALL MODULES MADE BY SUPER-ADMIN---++++++++++++++starts
            //STEP++++++++++++++++STARTS++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //
            async function getModulesData() {
              console.log("Inside getModulesData");
              return new Promise((resolve, reject) => {
                //   console.log(saveData);
                //
                const sql1 = con.query(
                  "SELECT id, name FROM modules WHERE active = 1 AND trash = 0", //, parent_id, slug, active, trash, created_at, updated_at
                  (err, response) => {
                    if (!err) {
                      if (response && response.length > 0) {
                        console.log("modules_data get success");
                        //array is defined and is not empty
                        //console.log(response);
                        //
                        //removing row data packet-------------STARTS
                        var resultArray = Object.values(
                          JSON.parse(JSON.stringify(response))
                        );
                        // console.log(resultArray);
                        //removing row data packet-------------ENDS
                        //
                        // const Response = {
                        //   status: "success",
                        //   responsedata: { modules: resultArray },
                        // };
                        // res.status(200).json(Response);
                        modules_data = resultArray; //data into global variable
                        //GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG
                        resolve({
                          result: 1,
                        });
                      } else {
                        console.log("STEP_3 ERROR");
                        console.log(
                          "SQL ERROR - No data Got - Sql Query - Modules"
                        );
                        messageERR = "Server Error";
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
                      console.log("STEP_3 ERROR");
                      console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                      console.log("Get Modules sql error");
                      console.log(err);
                      messageERR = "Server Error";
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
                console.log(sql1.sql);
                //
              }).catch((error) => console.log(error.message));
            }
            modules_data_resp = await getModulesData();
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            // console.log(modules_data_resp);
            console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
            //STEP-3 NOW GET ALL MODULES MADE BY SUPER-ADMIN---++++++++++++++ends
            //STEP++++++++++++++++ENDS++++++++++++++++++++++++++
            //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
            //
            if (
              modules_data_resp &&
              modules_data_resp !== undefined &&
              Object.keys(modules_data_resp).length != 0 &&
              modules_data_resp.result > 0
            ) {
              console.log("STEP-3 DONE SUCCESSFULLY");
              console.log("STEP-4 STARTS");
              //DATA MATCH N COMPILE -------------------STARTS
              var result = Object.entries(role_permissions_data);
              //   console.log(result);
              //
              var arrRolePermissionInsert = [];
              modules_data.map((item) => {
                result.map((item1) => {
                  if (item1[0] == item.name) {
                    arrRolePermissionInsert.push([
                      roleId, //role_id,
                      item.id, // module_id,
                      item1[1],
                    ]);
                    //role_id, module_id, access
                  }
                });
              });
              console.log(arrRolePermissionInsert);
              //DATA MATCH N COMPILE -------------------ENDS
              if (arrRolePermissionInsert.length > 0) {
                console.log(
                  "Array data there to save permissions in role_permissions"
                );
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                const saveRolePermissions = async (dataTosave) => {
                  console.log("Inside saveRolePermissions");
                  return new Promise((resolve, reject) => {
                    //LOOP - for inserting - STARTS-&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                    //
                    //SQLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL--STARTS
                    const sql = con.query(
                      "INSERT INTO role_permission (role_id, module_id, access) VALUES ?",
                      [dataTosave],
                      (err, result) => {
                        if (!err) {
                          if (result && result.affectedRows > 0) {
                            console.log("Step-4 -- Insert Success");
                            resolve({
                              result: 1,
                            });
                          } else {
                            console.log("STEP_4 ERROR");
                            console.log("Nothing Inserted");
                            console.log(
                              "SQL ERROR - insert Query - role_permission"
                            );
                            messageERR = "Server Error";
                            // const Error = {
                            //   status: "error",
                            //   message: "Server Error",
                            // };
                            // res.status(400).json(Error);
                            reject({
                              result: 0,
                            });
                          }
                        } else {
                          console.log("STEP_4 ERROR");
                          console.log("ERRRRRRRRRRRRRRRRORRRRRRRRRR");
                          console.log("Insert role_permission sql error");
                          console.log(err);
                          messageERR = "Server Error";
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
                    //SQLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL--ENDS
                    //
                    //LOOP - for inserting - ENDS-&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
                  }).catch((error) => console.log(error.message));
                };
                save_role_permissions_data_resp = await saveRolePermissions(
                  arrRolePermissionInsert
                );
                console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
                // console.log(
                //   save_role_permissions_data_resp
                // );
                console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //
                if (
                  save_role_permissions_data_resp &&
                  save_role_permissions_data_resp !== undefined &&
                  Object.keys(save_role_permissions_data_resp).length != 0 &&
                  save_role_permissions_data_resp.result > 0
                ) {
                  console.log("Everything done");
                  const Response = {
                    status: "success",
                    message: "Updated Successfully",
                  };
                  res.status(200).json(Response);
                } else {
                  console.log("STEP 4 Error");
                  const Error = {
                    status: "error",
                    message: messageERR,
                    // message: "Server Error",
                  };
                  res.status(400).json(Error);
                }
                //
              } else {
                console.log("STEP 4 Error");
                console.log(
                  "No Array Data to save permissions in role_permissions"
                );
                const Error = {
                  status: "error",
                  message: messageERR,
                  //  message: "Server Error",
                };
                res.status(400).json(Error);
              }
            } else {
              console.log("STEP 3 Error");
              const Error = {
                status: "error",
                message: messageERR,
              };
              res.status(400).json(Error);
            }
            //=====================================================================================

            //
            //
          } else {
            console.log("STEP 2 Error");
            const Error = {
              status: "error",
              message: messageERR,
              // message: "Server Error",
            };
            res.status(400).json(Error);
          }
        } else {
          console.log("ROLE PERMISSIONS DONT EXIST");
          console.log("Everything done");
          const Response = {
            status: "success",
            message: "Updated Successfully",
          };
          res.status(200).json(Response);
        }
      } else {
        console.log("STEP 1 Error");
        const Error = {
          status: "error",
          message: messageERR,
        };
        res.status(400).json(Error);
      }
      //
      // const Response = {
      //   status: "success",
      //   responsedata: { role: resultArray },
      // };
      // res.status(200).json(Response);
    } else {
      console.log("Invalid Details");
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    }
  } else {
    console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
