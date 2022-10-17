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
console.log("Inside Project Controller");
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
        //Get data for created Project-------------ENDS++++++++++++++++++++++
        //
      } else if (respAdd.status == "error") {
        //console.log("Error");
        const err = respAdd.message;
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
        dataToGet: "id, client_id, title, description, attachment, active",
      };
    } else if (idData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet: "id, client_id, title, description, attachment, active",
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
      console.log("Back 1-E");
      console.log(respError);
      const Error = {
        status: "error",
        message: respError.message,
      };
      res.status(respError.statusCode).json(Error);
    }
  }
  await getDataFunc(projectId);
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
