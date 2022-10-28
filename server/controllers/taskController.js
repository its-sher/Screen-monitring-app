const {
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("../helpers/instructions");
//
//console.log("Inside Task Controller");
const table_name = "task";
//
// CreateTask ----------------------------------------------------------------
const CreateTask = async (req, res) => {
  console.log("inside CreateTask");
  const dataTaskTable = req.body;
  //console.log(dataTaskTable);
  //
  if (
    dataTaskTable.project_id &&
    dataTaskTable.project_id > 0 &&
    dataTaskTable.employee_id &&
    dataTaskTable.employee_id > 0 &&
    dataTaskTable.status_id &&
    dataTaskTable.status_id > 0 &&
    dataTaskTable.title &&
    dataTaskTable.title.length > 0 &&
    dataTaskTable.detail &&
    dataTaskTable.detail.length > 0
  ) {
    //console.log(dataTaskTable);
    let filteredData = Object.fromEntries(
      Object.entries(dataTaskTable).filter(
        ([_, v]) => v != "null" && v != "" && v != null
      )
    );
    // console.log(filteredData);
    //
    //STEP_1---CreateTask and get data----------------STARTS
    //------------------------------------------------------
    async function CreateTask(saveData) {
      console.log("Inside CreateTask");
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
        //console.log("Success Task Created");
        const id = respAdd.id;
        //
        //Get data for created Task-------------STARTS++++++++++++++++++++++
        let view_payload = {
          table_name: table_name,
          dataToGet:
            "id, project_id, employee_id, status_id, title, detail, required_hours, estimated_time_of_accomplishment, actual_accomplishment_time",
          query_field: "id",
          query_value: id,
        };
        const respView = await view_query(view_payload);
        console.log("Back 2");
        //console.log(respView);
        if (respView.status == "success") {
          //console.log("Success Task Data Got");
          const Response = {
            message: respView.status,
            responsedata: { task: respView.data },
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
        //Get data for created Task-------------ENDS++++++++++++++++++++++
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
    await CreateTask(filteredData);
    //STEP_1---CreateTask and get data----------------ENDS
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
//GetTasks ---------------------------------------------------------------------------------
const GetTasks = async (req, res) => {
  console.log("inside GetTasks");
  //
  const taskId = req.params.id;
  // console.log(taskId);
  // console.log(typeof taskId); //string
  //
  async function getDataFunc(taskID) {
    //console.log("Inside getDataFunc");
    //
    var allData = 0;
    var idData = 0;
    var view_payload;
    taskID == "all" ? (allData = 1) : (idData = 1);
    //
    if (allData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, project_id, employee_id, status_id, title, detail, required_hours, estimated_time_of_accomplishment, actual_accomplishment_time",
      };
    } else if (idData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, project_id, employee_id, status_id, title, detail, required_hours, estimated_time_of_accomplishment, actual_accomplishment_time",
        query_field: "id",
        query_value: taskID,
      };
    }
    // console.log(view_payload);
    //
    const respView = await view_query(view_payload);
    console.log("Back 1");
    //console.log(respView);
    if (respView.status == "success") {
      //console.log("Success task Data Got");
      const Response = {
        message: respView.status,
        responsedata: { task: respView.data },
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
  await getDataFunc(taskId);
  //
};
//-----------------------------------------------------------------------------------------------------------
//
// UpdateTask -----------------------------------------------------------------
const UpdateTask = async (req, res) => {
  console.log("Inside UpdateTask");
  const data = req.body;
  // console.log(data);
  //
  const taskId = req.params.id;
  //console.log(taskId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    taskId &&
    taskId > 0
  ) {
    //console.log("Valid Details");
    //
    //STEP_1---------- UpdateTask ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: taskId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        //console.log("Success Task Data Updated");
        //
        //STEP_2---Get Data for Task----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const view_payload = {
            table_name: table_name,
            dataToGet:
              "id, project_id, employee_id, status_id, title, detail, required_hours, estimated_time_of_accomplishment, actual_accomplishment_time",
            query_field: "id",
            query_value: taskId,
          };
          // console.log(view_payload);
          const respView = await view_query(view_payload);
          console.log("Back 2");
          //console.log(respView);
          if (respView.status == "success") {
            //console.log("Success task Data Got");
            const Response = {
              message: respView.status,
              responsedata: { task: respView.data },
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
        //STEP_2---Get Data for Task----------------ENDS
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
      //STEP_1---------- UpdateTask ----------------ENDS
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
// DeleteTask (Trash)--------------------------------------------------
const DeleteTask = async (req, res) => {
  console.log("Inside DeleteTask");
  const taskId = req.params.id;
  // console.log(taskId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside deleteTask");
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
        trash: 1,
      },
    };
    //console.log(delete_payload);
    const respDelete = await trash_query(delete_payload);
    console.log("Back 1");
    //console.log(respDelete);
    if (respDelete.status == "success") {
      //console.log("Success Task Trash Deleted");
      const Response = {
        status: "success",
        message: "Task Deleted Successfully",
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
  await deleteConfigFunc(taskId);
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = {
  CreateTask, //done
  GetTasks, //done
  UpdateTask, //done
  DeleteTask, //done
};
