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
//console.log("Inside Client Controller");
const table_name = "client";
//
//-------------------------------------------------------------------------------------------------------------
//
// CreateClient ----------------------------------------------------------------
const CreateClient = async (req, res) => {
  console.log("inside CreateClient");
  const dataClientTable = req.body;
  //console.log(dataClientTable);
  //
  if (
    dataClientTable.first_Name &&
    dataClientTable.first_Name.length > 0 &&
    dataClientTable.last_Name &&
    dataClientTable.last_Name.length > 0 &&
    // dataClientTable.phone &&
    // dataClientTable.phone > 0 &&
    dataClientTable.email &&
    dataClientTable.email.length > 0
  ) {
    //console.log(dataClientTable);
    let filteredData = Object.fromEntries(
      Object.entries(dataClientTable).filter(
        ([_, v]) => v != "null" && v != "" && v != null
      )
    );
    // console.log(filteredData);
    //
    //STEP_1---createClient and get data----------------STARTS
    //------------------------------------------------------
    async function createClient(saveData) {
      console.log("Inside createClient");
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
        //console.log("Success Client Created");
        const id = respAdd.id;
        //
        //Get data for created Client-------------STARTS++++++++++++++++++++++
        let view_payload = {
          table_name: table_name,
          dataToGet:
            "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, source, active, description",
          query_field: "id",
          query_value: id,
        };
        const respView = await view_query(view_payload);
        console.log("Back 2");
        //console.log(respView);
        if (respView.status == "success") {
          //console.log("Success Client Data Got");
          const Response = {
            message: respView.status,
            responsedata: { client: respView.data },
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
        //Get data for created Client-------------ENDS++++++++++++++++++++++
        //
      } else if (respAdd.status == "error") {
        //console.log("Error");
        const err = respAdd.message;
        const respError = await error_query(err);
        console.log("Back 1-E");
        //  console.log(respError);
        const Error = {
          status: "error",
          message: respError.message,
        };
        res.status(respError.statusCode).json(Error);
      }
    }
    await createClient(filteredData);
    //STEP_1---createClient and get data----------------ENDS
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
//GetClient ---------------------------------------------------------------------------------
const GetClient = async (req, res) => {
  console.log("inside GetClient");
  //
  const clientId = req.params.id;
  // console.log(clientId);
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
          "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, source, active, description",
      };
    } else if (idData == 1) {
      view_payload = {
        table_name: table_name,
        dataToGet:
          "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, source, active, description",
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
      //console.log("Success Client Data Got");
      const Response = {
        message: respView.status,
        responsedata: { client: respView.data },
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
  await getDataFunc(clientId);
  //
};
//-----------------------------------------------------------------------------------------------------------
//
// UpdateClient -----------------------------------------------------------------
const UpdateClient = async (req, res) => {
  console.log("Inside UpdateClient");
  const data = req.body;
  // console.log(data);
  //
  const clientId = req.params.id;
  //console.log(clientId);
  //
  if (
    data &&
    data !== undefined &&
    Object.keys(data).length != 0 &&
    clientId &&
    clientId > 0
  ) {
    //console.log("Valid Details");
    //
    //STEP_1---------- UpdateClient ----------------STARTS
    //------------------------------------------------------
    async function updateDataFunc() {
      let update_payload = {
        table_name: table_name,
        query_field: "id",
        query_value: clientId,
        dataToSave: data,
      };
      //console.log(update_payload);
      const respEdit = await edit_query(update_payload);
      console.log("Back 1");
      //console.log(respEdit);
      if (respEdit.status == "success") {
        //console.log("Success Client Data Updated");
        //
        //STEP_2---Get Data for Client----------------STARTS
        //////////////////////////////////////////////////////
        async function getDataFunc() {
          console.log("Inside getDataFunc");
          //
          const view_payload = {
            table_name: table_name,
            dataToGet:
              "id, first_Name, last_Name, nick_name, phone, email, address_line1, address_line2, city, state, country, postal_code, image, gender, date_of_birth, source, active, description",
            query_field: "id",
            query_value: clientId,
          };
          // console.log(view_payload);
          const respView = await view_query(view_payload);
          console.log("Back 2");
          //console.log(respView);
          if (respView.status == "success") {
            //console.log("Success Client Data Got");
            const Response = {
              message: respView.status,
              responsedata: { client: respView.data },
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
        //STEP_2---Get Data for Client----------------ENDS
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
      //STEP_1---------- UpdateClient ----------------ENDS
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
// DeleteClient (Trash)--------------------------------------------------
const DeleteClient = async (req, res) => {
  console.log("Inside DeleteClient");
  const clientId = req.params.id;
  // console.log(clientId);
  //
  async function deleteConfigFunc(deleteID) {
    console.log("Inside DeleteClient");
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
      //console.log("Success Client Trash Deleted");
      const Response = {
        status: "success",
        message: "Client Deleted Successfully",
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
  await deleteConfigFunc(clientId);
  //
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//
module.exports = {
  CreateClient, //done
  GetClient, //done
  UpdateClient, //done
  DeleteClient, //done
};
