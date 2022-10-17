var moment = require("moment");
const con = require("../models/db");
const {
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("../helpers/instructions");
//
console.log("Inside Log Controller");
const table_name = "logs";
//
//-------------------------------------------------------------------------------------------------------------
//
// CreateLog ----------------------------------------------------------------
const CreateLog = async (req, res) => {
  console.log("inside CreateLog");
  const dataLogTable = req.body;
  //console.log(dataLogTable);
  //
  if (
    dataLogTable.employee_id &&
    dataLogTable.employee_id > 0 &&
    dataLogTable.attachment_name &&
    dataLogTable.attachment_name.length > 0 &&
    dataLogTable.data_time &&
    dataLogTable.activity_grade
  ) {
    //console.log(dataLogTable);
    let filteredData = Object.fromEntries(
      Object.entries(dataLogTable).filter(
        ([_, v]) => v != "null" && v != "" && v != null
      )
    );
    // console.log(filteredData);
    //
    //STEP_1---createLog and get data----------------STARTS
    //------------------------------------------------------
    async function createLog(saveData) {
      console.log("Inside createLog");
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
        //console.log("Success Log Created");
        const id = respAdd.id;
        //
        //Get data for created Log-------------STARTS++++++++++++++++++++++
        let view_payload = {
          table_name: table_name,
          dataToGet:
            "id, employee_id, attachment_name, data_time, activity_grade",
          query_field: "id",
          query_value: id,
        };
        const respView = await view_query(view_payload);
        console.log("Back 2");
        //console.log(respView);
        if (respView.status == "success") {
          //console.log("Success Log Data Got");
          const Response = {
            message: respView.status,
            responsedata: { log: respView.data },
          };
          res.status(201).json(Response);
        } else if (respView.status == "error") {
          //console.log("Error");
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
        //Get data for created Log-------------ENDS++++++++++++++++++++++
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
    await createLog(filteredData);
    //STEP_1---createLog and get data----------------ENDS
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
//GetLog ---------------------------------------------------------------------------------
const GetLog = async (req, res) => {
  console.log("inside GetLog");
  //
  const logId = req.params.id;
  // console.log(logId);
  //
  async function getDataFunc(configID) {
    //console.log("Inside getDataFunc");
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
          "id, employee_id, attachment_name, data_time, activity_grade",
      };
    } else if (idData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, employee_id, attachment_name, data_time, activity_grade",
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
      //console.log("Success Log Data Got");
      const Response = {
        message: respView.status,
        responsedata: { log: respView.data },
      };
      res.status(200).json(Response);
    } else if (respView.status == "error") {
      //console.log("Error");
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
  await getDataFunc(logId);
  //
};
//-----------------------------------------------------------------------------------------------------------
//
// UpdateLog -----------------------------------------------------------------
const UpdateLog = async (req, res) => {
  console.log("Inside UpdateLog");
  const data = req.body;
  // console.log(data);
  //
  const logId = req.params.id;
  //console.log(logId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    logId &&
    logId > 0
  ) {
    //console.log("Valid Details");
    //
    //STEP_1---------- UpdateLog ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: logId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        //console.log("Success Log Data Updated");
        //
        //STEP_2---Get Data for Log----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const view_payload = {
            table_name: table_name,
            dataToGet:
              "id, employee_id, attachment_name, data_time, activity_grade",
            query_field: "id",
            query_value: logId,
          };
          // console.log(view_payload);
          const respView = await view_query(view_payload);
          console.log("Back 2");
          //console.log(respView);
          if (respView.status == "success") {
            //console.log("Success Log Data Got");
            const Response = {
              message: respView.status,
              responsedata: { log: respView.data },
            };
            res.status(200).json(Response);
          } else if (respView.status == "error") {
            //console.log("Error");
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
        //STEP_2---Get Data for Log----------------ENDS
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
      //STEP_1---------- UpdateLog ----------------ENDS
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
// DeleteLog (Trash)--------------------------------------------------
const DeleteLog = async (req, res) => {
  console.log("Inside DeleteLog");
  const logId = req.params.id;
  // console.log(logId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside DeleteLog");
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
        //active: 0,
        trash: 1,
      },
    };
    //console.log(delete_payload);
    const respDelete = await trash_query(delete_payload);
    console.log("Back 1");
    //console.log(respDelete);
    if (respDelete.status == "success") {
      //console.log("Success Log Trash Deleted");
      const Response = {
        status: "success",
        message: "Log Deleted Successfully",
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
    //-------------------2--------------------------------------------------
  }
  await deleteConfigFunc(logId);
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
module.exports = {
  CreateLog, //done
  GetLog, //done
  UpdateLog, //done
  DeleteLog, //done
};
