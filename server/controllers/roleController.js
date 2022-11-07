const Role = require("../models/role");
//
/*-----------Roles------------------------------starts here--------------------*/
exports.Roles = async (req, res) => {
  var roleId;
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      const role_data = await fetch_single_role(roleId);
      try {
        const role_permission_data = await fetch_role_permission(roleId);
        role_data[0]["MODULES"] = role_permission_data;
        g_response["status"] = "success";
        g_response["responsedata"] = { role: role_data };
        g_status_code = 200;
      } catch (err) {
        //console.log("catch entities : ", err);
        g_response["status"] = "error";
        g_response["message"] = err.message;
        g_status_code = err.statusCode;
      }
    } catch (err) {
      //console.log("catch entities : ", err);
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  } else if (req.params && Object.keys(req.params).length == 0) {
    try {
      const role_data = await fetch_roles(roleId);
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
  } else {
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
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
  } else {
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
/*-----------TrashRole---------------------------ends here--------------------*/
//
/*-----------Delete---------------------------starts here--------------------*/
exports.Delete = async (req, res) => {
  var roleId;
  var g_response = {};
  var g_status_code;
  if (req.params.id && req.params.id > 0) {
    roleId = req.params.id;
    try {
      const role_permission_delete_data = await delete_role_permissions(roleId);
      try {
        const role_data = await delete_role(roleId);
        g_response["status"] = "success";
        g_response["message"] = role_data;
        g_status_code = 201;
      } catch (err) {
        g_response["status"] = "error";
        g_response["message"] = err.message;
        g_status_code = err.statusCode;
      }
    } catch (err) {
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
    res.status(g_status_code).json(g_response);
  } else {
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
/*-----------Delete---------------------------ends here--------------------*/
//
/*-----------CreateRole---------------------------starts here--------------------*/
exports.CreateRole = async (req, res) => {
  var g_response = {};
  var g_status_code;
  try {
    const sorted_role_data = await create_role_data_sort(req.body);
    var roleTableData = sorted_role_data.roleTableData;
    var rolePermissionTableData = sorted_role_data.rolePermissionTableData;
    try {
      const role_data = await create_role(roleTableData);
      const role_id = role_data[0].id;
      try {
        const module_data = await fetch_modules();
        try {
          const final_permission_table_data = await merge_modules_permissions(
            role_id,
            module_data,
            rolePermissionTableData
          );
          try {
            const result_data = await create_role_permission(
              final_permission_table_data
            );
            g_response["status"] = "success";
            g_response["responsedata"] = "Role Created Successfully";
            g_status_code = 201;
          } catch (err) {
            g_response["status"] = "error";
            g_response["message"] = err.message;
            g_status_code = err.statusCode;
          }
        } catch (err) {
          g_response["status"] = "error";
          g_response["message"] = err.message;
          g_status_code = err.statusCode;
        }
      } catch (err) {
        g_response["status"] = "error";
        g_response["message"] = err.message;
        g_status_code = err.statusCode;
      }
    } catch (err) {
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
  } catch (err) {
    g_response["status"] = "error";
    g_response["message"] = err.message;
    g_status_code = err.statusCode;
  }
  res.status(g_status_code).json(g_response);
};
/*-----------CreateRole---------------------------ends here--------------------*/
//
/*-----------UpdateRole---------------------------starts here--------------------*/
exports.UpdateRole = async (req, res) => {
  var g_response = {};
  var g_status_code;
  try {
    const check_data = await update_role_check_data(req);
    var role_id = req.params.id;
    try {
      const sorted_role_permission_data = await update_role_data_sort(req);
      var roleTableData = sorted_role_permission_data.roleTableData;
      var rolePermissionTableData =
        sorted_role_permission_data.rolePermissionTableData;
      if (
        roleTableData &&
        roleTableData !== undefined &&
        Object.keys(roleTableData).length != 0
      ) {
        //Role table data to update exists-------------------
        const edit_payload = {
          id: role_id,
          data: roleTableData,
        };
        try {
          const role_data = await update_role(edit_payload);
          if (
            rolePermissionTableData &&
            rolePermissionTableData !== undefined &&
            Object.keys(rolePermissionTableData).length != 0
          ) {
            //Role_Permission table data to update exists-------------------
            try {
              const role_permission_delete_data = await delete_role_permissions(
                role_id
              );
              try {
                const module_data = await fetch_modules();
                try {
                  const final_permission_table_data =
                    await merge_modules_permissions(
                      role_id,
                      module_data,
                      rolePermissionTableData
                    );
                  try {
                    const result_data = await create_role_permission(
                      final_permission_table_data
                    );
                    g_response["status"] = "success";
                    g_response["responsedata"] = "Role Created Successfully";
                    g_status_code = 201;
                  } catch (err) {
                    g_response["status"] = "error";
                    g_response["message"] = err.message;
                    g_status_code = err.statusCode;
                  }
                } catch (err) {
                  g_response["status"] = "error";
                  g_response["message"] = err.message;
                  g_status_code = err.statusCode;
                }
              } catch (err) {
                g_response["status"] = "error";
                g_response["message"] = err.message;
                g_status_code = err.statusCode;
              }
            } catch (err) {
              g_response["status"] = "error";
              g_response["message"] = err.message;
              g_status_code = err.statusCode;
            }
          } else {
            //Only role data present which is updated----------------
            g_response["status"] = "success";
            g_response["responsedata"] = "Role Updated Successfully";
            g_status_code = 200;
          }
        } catch (err) {
          g_response["status"] = "error";
          g_response["message"] = err.message;
          g_status_code = err.statusCode;
        }
      } else if (
        rolePermissionTableData &&
        rolePermissionTableData !== undefined &&
        Object.keys(rolePermissionTableData).length != 0
      ) {
        //Role_Permission table data to update exists-------------------
        try {
          const role_permission_delete_data = await delete_role_permissions(
            role_id
          );
          try {
            const module_data = await fetch_modules();
            try {
              const final_permission_table_data =
                await merge_modules_permissions(
                  role_id,
                  module_data,
                  rolePermissionTableData
                );
              try {
                const result_data = await create_role_permission(
                  final_permission_table_data
                );
                g_response["status"] = "success";
                g_response["responsedata"] = "Role Created Successfully";
                g_status_code = 201;
              } catch (err) {
                g_response["status"] = "error";
                g_response["message"] = err.message;
                g_status_code = err.statusCode;
              }
            } catch (err) {
              g_response["status"] = "error";
              g_response["message"] = err.message;
              g_status_code = err.statusCode;
            }
          } catch (err) {
            g_response["status"] = "error";
            g_response["message"] = err.message;
            g_status_code = err.statusCode;
          }
        } catch (err) {
          g_response["status"] = "error";
          g_response["message"] = err.message;
          g_status_code = err.statusCode;
        }
      } else {
        //No data to update------------------------
        g_response["status"] = "error";
        g_response["message"] = "Invalid Details";
        g_status_code = 400;
      }
    } catch (err) {
      g_response["status"] = "error";
      g_response["message"] = err.message;
      g_status_code = err.statusCode;
    }
  } catch (err) {
    g_response["status"] = "error";
    g_response["message"] = err.message;
    g_status_code = err.statusCode;
  }
  res.status(g_status_code).json(g_response);
};
/*-----------UpdateRole---------------------------ends here--------------------*/
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
const fetch_role_permission = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.fetchRolePermission(roleId, (err, res) => {
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
const create_role_data_sort = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.title &&
      data.title.length &&
      data.MODULES &&
      data.MODULES !== undefined &&
      Object.keys(data.MODULES).length != 0
    ) {
      var roleTableData = {};
      var rolePermissionTableData = {};
      //Data for role table--------------_STARTS
      roleTableData["title"] = data.title;
      if (data.hasOwnProperty("parent_role")) {
        roleTableData.parent_role = data.parent_role;
      }
      if (data.hasOwnProperty("description")) {
        roleTableData.description = data.description;
      }
      if (data.hasOwnProperty("active")) {
        roleTableData.active = data.active;
      }
      //  console.log(roleTableData);
      //Data for role table--------------ENDS
      //
      //Data for role_permission table--------------_STARTS
      rolePermissionTableData = data.MODULES;
      //  console.log(rolePermissionTableData);
      //Data for role_permission table--------------ENDS
      //
      const returningData = {
        roleTableData: roleTableData,
        rolePermissionTableData: rolePermissionTableData,
      };
      resolve(returningData);
    } else {
      const Error = { statusCode: 400, message: "Invalid Details" };
      reject(Error);
    }
  });
};
const create_role = (data) => {
  return new Promise((resolve, reject) => {
    Role.createRole(data, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const fetch_modules = () => {
  return new Promise((resolve, reject) => {
    Role.fetchModules((err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const merge_modules_permissions = (
  role_id,
  module_data,
  rolePermissionTableData
) => {
  return new Promise((resolve, reject) => {
    var result = Object.entries(rolePermissionTableData);
    //   console.log(result);
    var arrRolePermission = [];
    module_data.map((item) => {
      result.map((item1) => {
        if (item1[0] == item.name) {
          arrRolePermission.push([
            role_id, //role_id,
            item.id, // module_id,
            item1[1], //access
          ]);
        }
      });
    });
    resolve(arrRolePermission);
  });
};
const create_role_permission = (data) => {
  return new Promise((resolve, reject) => {
    Role.createRolePermission(data, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const update_role_check_data = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.params.id &&
      data.params.id > 0 &&
      data.body &&
      data.body !== undefined &&
      Object.keys(data.body).length != 0
    ) {
      resolve(true);
    } else {
      const Error = { statusCode: 400, message: "Invalid Details" };
      reject(Error);
    }
  });
};
const update_role_data_sort = (req_data) => {
  return new Promise((resolve, reject) => {
    const data = req_data.body;
    var roleTableData = {};
    var rolePermissionTableData = {};
    //Data for role table--------------_STARTS
    if (data.hasOwnProperty("title") && data.title.length > 0) {
      roleTableData["title"] = data.title;
    }
    if (data.hasOwnProperty("description")) {
      roleTableData["description"] = data.description;
    }
    if (
      data.hasOwnProperty("parent_role") &&
      (data.parent_role > 0 || data.parent_role == null)
    ) {
      roleTableData["parent_role"] = data.parent_role;
    }
    if (
      data.hasOwnProperty("active") &&
      (data.active == 0 || data.active == 1)
    ) {
      roleTableData.active = data.active;
    }
    //  console.log(roleTableData);
    //Data for role table--------------ENDS
    //
    //Data for role_permission table--------------_STARTS
    if (
      data.hasOwnProperty("MODULES") &&
      data.MODULES !== undefined &&
      Object.keys(data.MODULES).length != 0
    ) {
      rolePermissionTableData = data.MODULES;
    }
    //  console.log(rolePermissionTableData);
    //Data for role_permission table--------------ENDS
    //
    const returningData = {
      roleTableData: roleTableData,
      rolePermissionTableData: rolePermissionTableData,
    };
    resolve(returningData);
  });
};
const update_role = (data) => {
  return new Promise((resolve, reject) => {
    Role.updateRole(data, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
const delete_role_permissions = (roleId) => {
  return new Promise((resolve, reject) => {
    Role.deleteRolePermissions(roleId, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
//----FUNCTIONS----------------------------------------------------------ENDS
//-----------------------------------------------------------------------------------------------------------------
