const con = require("./db");
const Model = require("../helpers/instructions");
const table_role = "role";
const table_permission = "role_permission";
const table_module = "module";
// Plan object constructor
var Role = function () {};
//
/*-----------fetchRole------------------------------starts here--------------------*/
Role.fetchRole = async (roleId, result) => {
  let sql_query_payload = {
    sql_script: `SELECT r.id, r.title, r.parent_role, r1.title as parent_role_name, r.description, r.active FROM ${table_role} as r LEFT JOIN ${table_role} as r1 ON r1.id=r.parent_role WHERE r.id=${roleId}`,
    method: "get",
  };
  const respRole = await Model.sql_query(sql_query_payload);
  if (respRole.status == "success") {
    result(null, respRole.data);
  } else if (respRole.status == "error") {
    const err = respRole.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------fetchRole------------------------------ends here--------------------*/
//
/*-----------fetchRoles------------------------------starts here--------------------*/
Role.fetchRoles = async (result) => {
  let sql_query_payload = {
    sql_script: `SELECT r.id, r.title, r.parent_role, r1.title as parent_role_name, r.description, r.active, r.trash, r.created_At, r.updated_at FROM ${table_role} as r LEFT JOIN ${table_role} as r1 ON r1.id=r.parent_role`, // ORDER BY r.updated_at DESC
    method: "get",
  };
  const respSql = await Model.sql_query(sql_query_payload);
  if (respSql.status == "success") {
    result(null, respSql.data);
  } else if (respSql.status == "error") {
    const err = respSql.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------fetchRoles------------------------------ends here--------------------*/
//
/*-----------fetchRoleByParent------------------------------starts here--------------------*/
Role.fetchRolesByParent = async (roleId, result) => {
  let sql_query_payload = {
    sql_script: `SELECT r.id, r.title, r.parent_role, r1.title as parent_role_name, r.description, r.active FROM ${table_role} as r LEFT JOIN ${table_role} as r1 ON r1.id=r.parent_role WHERE r.parent_role=${roleId}`,
    method: "get",
  };

  const respSql = await Model.sql_query(sql_query_payload);
  if (respSql.status == "success") {
    result(null, respSql.data);
  } else if (respSql.status == "error") {
    const err = respSql.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------fetchRoleByParent------------------------------ends here--------------------*/
//
/*-----------fetchRolePermission------------------------------starts here--------------------*/
Role.fetchRolePermission = async (roleId, result) => {
  let sql_query_payload = {
    sql_script: `SELECT concat('"MODULES":{', GROUP_CONCAT(concat('"',m.name,'":"',urp.access,'"') SEPARATOR ','),'}') as data FROM ${table_permission} as urp LEFT JOIN ${table_module} as m ON m.id=urp.module_id LEFT JOIN ${table_role} as r ON r.id=urp.role_id WHERE urp.role_id=${roleId} GROUP BY r.title`,
    method: "get",
  };
  const respPermission = await Model.sql_query(sql_query_payload);
  if (respPermission.status == "success") {
    //now add curly braces and make json string---starts
    const jsonStringData = "{" + respPermission.data[0].data + "}";
    //now add curly braces and make json string---ends
    //
    //nw parse the data-----------------STARTS
    const jsonParsedData = JSON.parse(jsonStringData);
    //nw parse the data-----------------ENDS
    //
    result(null, jsonParsedData.MODULES);
  } else if (respPermission.status == "error") {
    const err = respPermission.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------fetchRolePermission------------------------------ends here--------------------*/
//
/*-----------trash------------------------------starts here--------------------*/
Role.trash = async (roleId, result) => {
  let delete_payload = {
    table_name: table_role,
    query_field: "id",
    query_value: roleId,
    dataToSave: {
      active: 0,
      trash: 1,
    },
  };
  const respDelete = await Model.trash_query(delete_payload);
  if (respDelete.status == "success") {
    const message = "Role Deleted Successfully";
    result(null, message);
  } else if (respDelete.status == "error") {
    const err = respDelete.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------trash------------------------------ends here--------------------*/
//
/*-----------delete------------------------------starts here--------------------*/
Role.delete = async (roleId, result) => {
  let delete_payload = {
    table_name: table_role,
    query_field: "id",
    query_value: roleId,
  };
  const respDelete = await Model.delete_query(delete_payload);
  if (respDelete.status == "success") {
    const message = "Role Deleted Successfully";
    result(null, message);
  } else if (respDelete.status == "error") {
    const err = respDelete.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------delete------------------------------ends here--------------------*/
//
/*-----------createRole------------------------------starts here--------------------*/
Role.createRole = async (saveData, result) => {
  //CREATE ROLE-------------------------STARTS
  let add_payload = {
    table_name: table_role,
    dataToSave: saveData,
  };
  const respAdd = await Model.add_query(add_payload);
  if (respAdd.status == "success") {
    const id = respAdd.id;
    //Get data for created ROLE-------------STARTS++++++++++++++++++++++
    let sql_query_payload = {
      sql_script: `SELECT r.id, r.title, r.parent_role, r1.title as parent_role_name, r.description, r.active FROM ${table_role} as r LEFT JOIN ${table_role} as r1 ON r1.id=r.parent_role WHERE r.id=${id}`,
      method: "get",
    };
    const respRole = await Model.sql_query(sql_query_payload);
    if (respRole.status == "success") {
      result(null, respRole.data);
    } else if (respRole.status == "error") {
      const err = respRole.message;
      const respError = await Model.error_query(err);
      const Error = {
        status: "error",
        message: respError.message,
        statusCode: respError.statusCode,
      };
      result(Error, null);
    }
    //Get data for created ROLE-------------ENDS++++++++++++++++++++++
  } else if (respAdd.status == "error") {
    const err = respAdd.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
  //CREATE ROLE-------------------------ENDS
};
/*-----------createRole------------------------------ends here--------------------*/
//
/*-----------fetchModules------------------------------starts here--------------------*/
Role.fetchModules = async (result) => {
  let sql_query_payload = {
    sql_script: `SELECT id, name FROM ${table_module} WHERE active = 1 AND trash = 0`,
    method: "get",
  };
  const respSql = await Model.sql_query(sql_query_payload);
  if (respSql.status == "success") {
    result(null, respSql.data);
  } else if (respSql.status == "error") {
    const err = respSql.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------fetchModules------------------------------ends here--------------------*/
//
/*-----------createRolePermission------------------------------starts here--------------------*/
Role.createRolePermission = async (saveData, result) => {
  //CREATE ROLE PERMISSION-------------------------STARTS
  console.log(saveData);
  const sql = con.query(
    "INSERT INTO role_permission (role_id, module_id, access) VALUES ?",
    [saveData],
    async (err, result1) => {
      if (!err) {
        if (result1 && result1.affectedRows > 0) {
          const LLastID = result1.insertId;
          const Response = {
            status: "success",
          };
          result(null, Response);
        } else {
          const Error = {
            status: "error",
            message: "error",
          };
          if (Error.status == "error") {
            const err = Error.message;
            const respError = await Model.error_query(err);
            const Error = {
              status: "error",
              message: respError.message,
              statusCode: respError.statusCode,
            };
            result(Error, null);
          }
        }
      } else {
        console.log(err);
        const Error = {
          status: "error",
          message: err,
        };
        if (Error.status == "error") {
          const err = Error.message;
          const respError = await Model.error_query(err);
          const Error = {
            status: "error",
            message: respError.message,
            statusCode: respError.statusCode,
          };
          result(Error, null);
        }
      }
    }
  );
  //console.log(sql.sql);
  // let sql_query_payload = {
  //   sql_script: `"INSERT INTO role_permission (role_id, module_id, access) VALUES ?",
  //   ${saveData}`,
  //   method: "get",
  // };
  // const respAdd = await Model.sql_query(sql_query_payload);
  // if (respAdd.status == "success") {
  //   result(null, respAdd);
  // } else if (respAdd.status == "error") {
  //   const err = respAdd.message;
  //   const respError = await Model.error_query(err);
  //   const Error = {
  //     status: "error",
  //     message: respError.message,
  //     statusCode: respError.statusCode,
  //   };
  //   result(Error, null);
  // }
  //CREATE ROLE PERMISSION-------------------------ENDS
};
/*-----------createRolePermission------------------------------ends here--------------------*/
//
/*-----------updateRole------------------------------starts here--------------------*/
Role.updateRole = async (data, result) => {
  const role_id = data.id;
  const update_data = data.data;
  let update_payload = {
    table_name: table_role,
    query_field: "id",
    query_value: role_id,
    dataToSave: update_data,
  };
  const respEdit = await Model.edit_query(update_payload);
  if (respEdit.status == "success") {
    const Response = {
      status: "success",
    };
    result(null, Response);
  } else if (respEdit.status == "error") {
    const err = respEdit.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------updateRole------------------------------ends here--------------------*/
//
/*-----------deleteRolePermissions------------------------------starts here--------------------*/
Role.deleteRolePermissions = async (roleId, result) => {
  let delete_payload = {
    table_name: table_permission,
    query_field: "role_id",
    query_value: roleId,
  };
  const respDelete = await Model.delete_query(delete_payload);
  if (respDelete.status == "success") {
    const message = "Role Deleted Successfully";
    result(null, message);
  } else if (respDelete.status == "error") {
    const err = respDelete.message;
    const respError = await Model.error_query(err);
    const Error = {
      status: "error",
      message: respError.message,
      statusCode: respError.statusCode,
    };
    result(Error, null);
  }
};
/*-----------deleteRolePermissions------------------------------ends here--------------------*/
//

module.exports = Role;
