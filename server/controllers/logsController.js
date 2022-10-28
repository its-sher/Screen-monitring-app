var moment = require("moment");
const con = require("../models/db");
const {
  sql_query,
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("../helpers/instructions");
//
//console.log("Inside Log Controller");
const domainpath = process.env.REACT_APP_DOMAIN_ENDPOINT;
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
    dataLogTable.attachment_title &&
    dataLogTable.attachment_title.length > 0 &&
    dataLogTable.attachment_url &&
    dataLogTable.attachment_url.length > 0 &&
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
    //STEP_0---createAttachment and return id----------------STARTS
    //
    //collect data for attachment===starts
    var attachment_data = {};
    attachment_data["title"] = filteredData.attachment_title;
    delete filteredData.attachment_title;
    attachment_data["url"] = filteredData.attachment_url;
    //condition if more than one then make it one string ---starts
    const imagesArray = filteredData.attachment_url;
    if (imagesArray.length > 1) {
      var imagesString = imagesArray.join(",");
      //console.log(imagesString);
      attachment_data["url"] = imagesString;
    } else {
      attachment_data["url"] = filteredData.attachment_url;
    }
    //condition if more than one then make it one string ---ends
    delete filteredData.attachment_url;
    //collect data for attachment===ends
    //
    //console.log(attachment_data);
    async function createAttachment(saveData) {
      console.log("Inside createAttachment");
      //   console.log(saveData);
      //
      let add_payload = {
        table_name: "attachment",
        dataToSave: saveData,
      };
      //console.log(add_payload);
      const respAdd = await add_query(add_payload);
      console.log("Back 0");
      //console.log(respAdd);
      if (respAdd.status == "success") {
        //console.log("Success Log Created");
        const id = respAdd.id;
        filteredData["attachment_id"] = id;
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
            let sql_query_payload = {
              sql_script:
                "SELECT l.id, l.employee_id, l.attachment_id, a.title as attachment_title, a.url as attachment_url, l.data_time, l.activity_grade FROM logs as l LEFT JOIN attachment as a ON l.attachment_id=a.id WHERE l.id=",
              sql_values: id,
            };
            const respView = await sql_query(sql_query_payload);
            console.log("Back 2");
            // console.log(respView);
            if (respView.status == "success") {
              //console.log("Success Log Data Got");
              //
              //removing row data packet-------------STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
              var resultArray = Object.values(
                JSON.parse(JSON.stringify(respView.data))
              );
              //console.log(resultArray);
              //removing row data packet-------------ENDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
              //
              //HANDLING IMAGES ---starts
              const strdata = resultArray[0].attachment_url;
              console.log(strdata);
              //if images is not null then convert to array and then concat
              if (strdata != null) {
                // console.log("hello");
                let var1 = strdata.split(","); //array made
                //concat in array
                let var2 = var1.map((item1) => {
                  return domainpath.concat(item1);
                });
                // console.log(var2);
                //delete item.images;//didnt req as it overwrites data
                resultArray[0].attachment_url = var2; //put new data to images.item
                //
              }
              //HANDLING IMAGES ---ends
              //
              const Response = {
                message: respView.status,
                responsedata: { log: resultArray },
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

        //
      } else if (respAdd.status == "error") {
        //console.log("Error");
        const err = respAdd.message;
        const respError = await error_query(err);
        console.log("Back 0-E");
        //console.log(respError);
        const Error = {
          status: "error",
          message: respError.message,
        };
        res.status(respError.statusCode).json(Error);
      }
    }
    await createAttachment(attachment_data);
    //STEP_0---createAttachment and return id----------------ENDS
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
  async function getDataFunc(logID) {
    //console.log("Inside getDataFunc");
    //
    var allData = 0;
    var idData = 0;
    var sql_query_payload;
    logID == "all" ? (allData = 1) : (idData = 1);
    //
    if (allData == 1) {
      sql_query_payload = {
        sql_script:
          "SELECT l.id, l.employee_id, l.attachment_id, a.title as attachment_title, a.url as attachment_url, l.data_time, l.activity_grade FROM logs as l LEFT JOIN attachment as a ON l.attachment_id=a.id",
        sql_values: null,
      };
    } else if (idData == 1) {
      sql_query_payload = {
        sql_script:
          "SELECT l.id, l.employee_id, l.attachment_id, a.title as attachment_title, a.url as attachment_url, l.data_time, l.activity_grade FROM logs as l LEFT JOIN attachment as a ON l.attachment_id=a.id WHERE l.id=",
        sql_values: logID,
      };
    }
    // console.log(sql_query_payload);
    //
    const respView = await sql_query(sql_query_payload);
    console.log("Back 1");
    //console.log(respView);
    if (respView.status == "success") {
      //console.log("Success Log Data Got");
      //
      //removing row data packet-------------STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      var resultArray = Object.values(
        JSON.parse(JSON.stringify(respView.data))
      );
      //console.log(resultArray);
      //removing row data packet-------------ENDS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~/
      //
      //HANDLING IMAGE url concat, attributes ----------------------------------------STARTS
      //map response array resdata and get images from each item
      let resdatamap = resultArray.map((item) => {
        //console.log(item.images);
        //
        const strdata = item.attachment_url;
        //console.log(item);
        //if images is not null then convert to array and then concat
        if (strdata != null) {
          // console.log("hello");
          let var1 = strdata.split(","); //array made
          //concat in array
          let var2 = var1.map((item1) => {
            return domainpath.concat(item1);
          });
          // console.log(var2);
          //delete item.images;//didnt req as it overwrites data
          item.attachment_url = var2; //put new data to images.item
        }
        return item; //return modified item
      });
      // console.log(resdatamap);
      //HANDLING IMAGE url concat, attributes ---------------------------------------ENDS
      //
      const Response = {
        message: respView.status,
        responsedata: { log: resdatamap },
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
              "id, employee_id, attachment_id, data_time, activity_grade",
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
