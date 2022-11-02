const con = require("../models/db");
const {
  sql_query,
  add_query,
  view_query,
  edit_query,
  error_query,
  trash_query,
} = require("../helpers/instructions");
const table_name = "module";
//
// GetModules from database table --modules-DONE--------------------------------------------------------------
const GetModules = async (req, res) => {
  console.log("Inside GetModules");
  //
  //console.log(req.query);
  const query = req.query;
  //
  if (query && query !== undefined && Object.keys(query).length != 0) {
    //console.log("Valid url params");
    //
    var sql_query_payload;
    var moduleId;
    //
    if (
      query.hasOwnProperty("req") &&
      query.req == "parent" &&
      query.hasOwnProperty("id") &&
      query.id > 0 &&
      Object.keys(query).length == 2
    ) {
      moduleId = query.id;
      // console.log(moduleId);
      sql_query_payload = {
        sql_script: `SELECT m.id, m.name, m.parent_id, m1.name as parent_name, m.slug, m.active from ${table_name} as m LEFT JOIN ${table_name} as m1 ON m.parent_id=m1.id WHERE m.parent_id=${moduleId}`,
        method: "get",
      };
    } else if (
      query.hasOwnProperty("id") &&
      query.id > 0 &&
      Object.keys(query).length == 1
    ) {
      moduleId = query.id;
      // console.log(moduleId);
      sql_query_payload = {
        sql_script: `SELECT m.id, m.name, m.parent_id, m1.name as parent_name, m.slug, m.active from ${table_name} as m LEFT JOIN ${table_name} as m1 ON m.parent_id=m1.id WHERE m.id=${moduleId} AND m.trash = 0`,
        method: "get",
      };
    } else if (
      query.hasOwnProperty("req") &&
      query.req == "all" &&
      Object.keys(query).length == 1
    ) {
      sql_query_payload = {
        sql_script: `SELECT m.id, m.name, m.parent_id, m1.name as parent_name, m.slug, m.active from ${table_name} as m LEFT JOIN ${table_name} as m1 ON m.parent_id=m1.id WHERE m.trash = 0 ORDER BY m.updated_at DESC`,
        method: "get",
      };
    } else {
      console.log("Invalid url params");
      sql_query_payload = null;
    }
    //
    if (sql_query_payload == null) {
      const Error = { status: "error", message: "Invalid Details" };
      res.status(400).json(Error);
    } else {
      //STEP-1-----NOW GET DATA FROM module table----STARTS
      async function getDataFunc() {
        //console.log("Inside getDataFunc");
        //console.log(sql_query_payload);
        //
        const respSql = await sql_query(sql_query_payload);
        console.log("Back 1");
        // console.log(respSql);
        if (respSql.status == "success") {
          //console.log("Success Project Data Got");
          //
          const Response = {
            message: respSql.status,
            responsedata: { module: respSql.data },
          };
          res.status(200).json(Response);
        } else if (respSql.status == "error") {
          //console.log("Error");
          const err = respSql.message;
          console.log(err);
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
      //STEP-1-----NOW GET DATA FROM module table----ENDS
    }
  } else {
    console.log("Invalid url params");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
  //
};
//-------------------------------------------------------------------------------------------------------------
//
// CreateModule  into database table --modules-DONE--------------------------------------------------------------
const CreateModule = async (req, res) => {
  console.log("inside CreateModule");
  const dataModuleTable = req.body;
  //console.log(dataModuleTable);
  //
  if (
    (dataModuleTable.name &&
      dataModuleTable.name.length > 0 &&
      dataModuleTable.slug &&
      dataModuleTable.slug.length > 0) ||
    (dataModuleTable.name &&
      dataModuleTable.name.length > 0 &&
      dataModuleTable.slug &&
      dataModuleTable.slug.length > 0 &&
      dataModuleTable.parent_id &&
      dataModuleTable.parent_id > 0)
  ) {
    //console.log(dataModuleTable);
    let filteredData = Object.fromEntries(
      Object.entries(dataModuleTable).filter(
        ([_, v]) => v != "null" && v != "" && v != null
      )
    );
    // console.log(filteredData);
    //
    //STEP_1---createModule and get data----------------STARTS
    //------------------------------------------------------
    async function createModuleFunc(saveData) {
      console.log("Inside createModuleFunc");
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
        //console.log("Success Module Created");
        const id = respAdd.id;
        //
        //Get data for created module-------------STARTS++++++++++++++++++++++
        sql_query_payload = {
          sql_script: `SELECT m.id, m.name, m.parent_id, m1.name as parent_name, m.slug, m.active, m.created_at, m.updated_at from ${table_name} as m LEFT JOIN ${table_name} as m1 ON m.parent_id=m1.id WHERE m.id=${id}`,
          method: "get",
        };
        const respView = await sql_query(sql_query_payload);
        console.log("Back 2");
        //console.log(respView);
        if (respView.status == "success") {
          //console.log("Success MOdule Data Got");
          const Response = {
            message: respView.status,
            responsedata: { module: respView.data },
          };
          res.status(201).json(Response);
        } else if (respView.status == "error") {
          //console.log("Error");
          const err = respView.message;
          const respError = await error_query(err);
          console.log("Back 2-E");
          //console.log(respError);
          const Error = {
            status: "error",
            message: respError.message,
          };
          res.status(respError.statusCode).json(Error);
        }
        //Get data for created module-------------ENDS++++++++++++++++++++++
        //
      } else if (respAdd.status == "error") {
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
    await createModuleFunc(filteredData);
    //STEP_1---createModule and get data----------------ENDS
    //------------------------------------------------------
    //
  } else {
    //console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
//
// UPDATE a module  in database table --modules-----------------------------------------------
const UpdateModuleById = async (req, res) => {
  console.log("Inside UpdateModuleById");
  const data = req.body;
  // console.log(data);
  //
  const moduleId = req.params.id;
  //console.log(moduleId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    moduleId &&
    moduleId > 0
  ) {
    //console.log("Valid Details");
    //
    //STEP_1---------- UpdateModule ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: moduleId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        //console.log("Success Module Data Updated");
        //
        //STEP_2---Get Data for Module----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const sql_query_payload = {
            sql_script: `SELECT m.id, m.name, m.parent_id, m1.name as parent_name, m.slug, m.active from ${table_name} as m LEFT JOIN ${table_name} as m1 ON m.parent_id=m1.id WHERE m.id=${moduleId} AND m.trash = 0`,
            method: "get",
          };
          //console.log(sql_query_payload);
          const respSql = await sql_query(sql_query_payload);
          console.log("Back 2");
          //console.log(respSql);
          if (respSql.status == "success") {
            //console.log("Success module Data Got");
            const Response = {
              message: respSql.status,
              responsedata: { module: respSql.data },
            };
            res.status(200).json(Response);
          } else if (respSql.status == "error") {
            //console.log("Error");
            const err = respSql.message;
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
        //STEP_2---Get Data for Module----------------ENDS
        //////////////////////////////////////////////////////
        //
      } else if (respEdit.status == "error") {
        //console.log("Error");
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
      //STEP_1---------- UpdateModule ----------------ENDS
      //------------------------------------------------------
      //
    }
    await updateDataFunc();
    //////////////////////////////////////////////////////////////////////////////////
    //
  } else {
    //console.log("Invalid Details");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
};
//-----------------------------------------------------------------------------------------------------------------
//
// DeleteModuleById in database table --modules-----------------------------------------------STARTS
const DeleteModuleById = async (req, res) => {
  console.log("Inside DeleteModuleById");
  const moduleId = req.params.id;
  // console.log(moduleId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside deleteConfigFunc");
    //   console.log(deleteID);
    //-------------------1--------------------------------------------------
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
      //console.log("Success Module Trash Deleted");
      const Response = {
        status: "success",
        message: "Module Deleted Successfully",
      };
      res.status(201).json(Response);
    } else if (respDelete.status == "error") {
      //console.log("Error");
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
    //-------------------1--------------------------------------------------
  }
  await deleteConfigFunc(moduleId);
  //
};
// DeleteModuleById in database table --modules-----------------------------------------------ENDS

module.exports = {
  GetModules,
  CreateModule,
  UpdateModuleById,
  DeleteModuleById,
};
