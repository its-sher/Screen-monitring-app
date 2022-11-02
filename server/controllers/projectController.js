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
//console.log("Inside Project Controller");
const domainpath = process.env.REACT_APP_DOMAIN_ENDPOINT;
const table_name = "project";
//
//-------------------------------------------------------------------------------------------------------------
//
// CreateProject ----------------------------------------------------------------
const CreateProject = async (req, res) => {
  console.log("inside CreateProject");
  const dataProjectTable = req.body;
  //console.log(dataProjectTable);
  //
  if (
    dataProjectTable.client_id &&
    dataProjectTable.client_id > 0 &&
    dataProjectTable.title &&
    dataProjectTable.title.length > 0
  ) {
    //console.log(dataProjectTable);
    let filteredData = Object.fromEntries(
      Object.entries(dataProjectTable).filter(
        ([_, v]) => v != "null" && v != "" && v != null
      )
    );
    // console.log(filteredData);
    //
    //STEP_1---createProject and get data----------------STARTS
    //------------------------------------------------------
    async function createProject(saveData) {
      console.log("Inside createProject");
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
        //console.log("Success Project Created");
        const id = respAdd.id;
        //
        //Get data for created Project-------------STARTS++++++++++++++++++++++
        let view_payload = {
          table_name: table_name,
          dataToGet: "id, client_id, title, description, attachment, active",
          query_field: "id",
          query_value: id,
        };
        const respView = await view_query(view_payload);
        console.log("Back 2");
        //console.log(respView);
        if (respView.status == "success") {
          //console.log("Success Project Data Got");
          const Response = {
            message: respView.status,
            responsedata: { project: respView.data },
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
        //Get data for created Project-------------ENDS++++++++++++++++++++++
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
    await createProject(filteredData);
    //STEP_1---createProject and get data----------------ENDS
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
//GetProject ---------------------------------------------------------------------------------
const GetProject = async (req, res) => {
  console.log("inside GetProject");
  //
  const projectId = req.params.id;
  // console.log(projectId);
  if (projectId == "all" || projectId > 0) {
    //console.log("Valid url params");
    //
    //STEP-1 get user id from accesstoken--starts--------------------------------------1
    const access_token = req.headers.token;
    // console.log(access_token);
    async function getDataFunc1(access_token) {
      //console.log("Inside getDataFunc1");
      //
      const view_payload = {
        table_name: "employee",
        dataToGet: "id",
        query_field: "access_token",
        query_value: access_token,
      };
      //console.log(view_payload);
      //
      const respView = await view_query(view_payload);
      console.log("Back 1");
      console.log(respView);
      if (respView.status == "success") {
        //console.log("Success employee Data Got");
        const employeeId = respView.data[0].id;
        //console.log(employeeId);
        //STEP-2-----NOW GET DATA FROM project table wd employee id and all/id----STARTS
        async function getDataFunc2(configID, empID) {
          //console.log("Inside getDataFunc2");
          //console.log(configID);
          //console.log(empID);
          //
          var allData = 0;
          var idData = 0;
          var sql_query_payload;
          configID == "all" ? (allData = 1) : (idData = 1);
          //
          if (allData == 1) {
            sql_query_payload = {
              sql_script: `SELECT p.id, p.client_id, p.title, p.description, p.attachment_id, a.title as attachment_title, a.url as attachment_url, p.active FROM project as p LEFT JOIN attachment as a ON p.attachment_id=a.id WHERE p.assigned_to=${empID}`,
              method: "get",
            };
          } else if (idData == 1) {
            sql_query_payload = {
              sql_script: `SELECT p.id, p.client_id, p.title, p.description, p.attachment_id, a.title as attachment_title, a.url as attachment_url, p.active FROM project as p LEFT JOIN attachment as a ON p.attachment_id=a.id WHERE p.assigned_to=${empID} AND p.id=${configID}`,
              method: "get",
            };
          }
          //console.log(sql_query_payload);
          //
          const respSql = await sql_query(sql_query_payload);
          console.log("Back 2");
          // console.log(respSql);
          if (respSql.status == "success") {
            //console.log("Success Project Data Got");
            //
            //removing row data packet-------------STARTS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            var resultArray = Object.values(
              JSON.parse(JSON.stringify(respSql.data))
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
              message: respSql.status,
              responsedata: { project: resdatamap },
            };
            res.status(200).json(Response);
          } else if (respSql.status == "error") {
            //console.log("Error");
            const err = respSql.message;
            const respError = await error_query(err);
            console.log("Back 2-E");
            //console.log(respError);
            const Error = {
              status: "error",
              message: respError.message,
            };
            res.status(respError.statusCode).json(Error);
          }
        }
        await getDataFunc2(projectId, employeeId);
        //STEP-2-----NOW GET DATA FROM project table wd employee id and all/id----ENDS
        //
      } else if (respView.status == "error") {
        //console.log("Error");
        const err = respView.message;
        //{ code: 'NO_DATA', sqlMessage: 'No Data' }
        if (err.code == "NO_DATA") {
          const Error = {
            status: "error",
            message: "Forbidden!! UnAuthorized Access!!",
          };
          return res.status(403).json(Error);
        } else {
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
    }
    await getDataFunc1(access_token);
    //STEP-1 get user id from accesstoken--ends--------------------------------------2
    //
  } else {
    console.log("Invalid url params");
    const Error = { status: "error", message: "Invalid Details" };
    res.status(400).json(Error);
  }
  //
};
//-----------------------------------------------------------------------------------------------------------
//
// UpdateProject -----------------------------------------------------------------
const UpdateProject = async (req, res) => {
  console.log("Inside UpdateProject");
  const data = req.body;
  // console.log(data);
  //
  const projectId = req.params.id;
  //console.log(projectId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    projectId &&
    projectId > 0
  ) {
    //console.log("Valid Details");
    //
    //STEP_1---------- UpdateProject ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: projectId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        //console.log("Success Project Data Updated");
        //
        //STEP_2---Get Data for Project----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const view_payload = {
            table_name: table_name,
            dataToGet: "id, client_id, title, description, attachment, active",
            query_field: "id",
            query_value: projectId,
          };
          // console.log(view_payload);
          const respView = await view_query(view_payload);
          console.log("Back 2");
          //console.log(respView);
          if (respView.status == "success") {
            //console.log("Success Project Data Got");
            const Response = {
              message: respView.status,
              responsedata: { project: respView.data },
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
        //STEP_2---Get Data for Project----------------ENDS
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
      //STEP_1---------- UpdateProject ----------------ENDS
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
// DeleteProject (Trash)--------------------------------------------------
const DeleteProject = async (req, res) => {
  console.log("Inside DeleteProject");
  const projectId = req.params.id;
  // console.log(projectId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside DeleteProject");
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
      //console.log("Success Project Trash Deleted");
      const Response = {
        status: "success",
        message: "Project Deleted Successfully",
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
  await deleteConfigFunc(projectId);
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
module.exports = {
  CreateProject, //done
  GetProject, //done
  UpdateProject, //done
  DeleteProject, //done
};
