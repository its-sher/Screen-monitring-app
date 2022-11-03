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
  var role_data;
  let sql_query_payload = {
    sql_script: `SELECT r.id, r.title, r.parent_role, r1.title as parent_role_name, r.description, r.active FROM ${table_role} as r LEFT JOIN ${table_role} as r1 ON r1.id=r.parent_role WHERE r.id=${roleId}`,
    method: "get",
  };
  const respRole = await Model.sql_query(sql_query_payload);
  if (respRole.status == "success") {
    role_data = respRole.data;
    //result(null, respRole.data);
    //NEXT STEP---------------------------------------STARTS****************
    let sql_query_payload1 = {
      sql_script: `SELECT concat('"MODULES":{', GROUP_CONCAT(concat('"',m.name,'":"',urp.access,'"') SEPARATOR ','),'}') as data FROM ${table_permission} as urp LEFT JOIN ${table_module} as m ON m.id=urp.module_id LEFT JOIN ${table_role} as r ON r.id=urp.role_id WHERE urp.role_id=${roleId} GROUP BY r.title`,
      method: "get",
    };
    const respPermission = await Model.sql_query(sql_query_payload1);
    if (respPermission.status == "success") {
      //now add curly braces and make json string---starts
      const jsonStringData = "{" + respPermission.data[0].data + "}";
      //now add curly braces and make json string---ends
      //
      //nw parse the data-----------------STARTS
      const jsonParsedData = JSON.parse(jsonStringData);
      //nw parse the data-----------------ENDS
      //
      role_data[0]["MODULES"] = jsonParsedData.MODULES;
      //
      result(null, role_data);
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
    //NEXT STEP---------------------------------------ENDS****************
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
  //console.log(delete_payload);
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
  //console.log(delete_payload);
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
module.exports = Role;
