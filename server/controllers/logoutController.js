const { edit_query, error_query } = require("../helpers/instructions");
//console.log("Inside Logout controller");
const table_name = "employees";

const Logout = async (req, res) => {
  console.log("Inside logout api");
  // console.log(req.headers);
  const access_token = req.headers.token;
  // console.log(access_token);
  //
  //STEP-1 UPDATE DB and make ACESSTOKEN, expiry null--------starts
  let update_payload = {
    table_name: table_name,
    query_field: "access_token",
    query_value: access_token,
    dataToSave: {
      access_token: null,
      access_token_expires_in: null,
    },
  };
  //console.log(update_payload);
  async function updateUser(saveData) {
    //  console.log("Inside updateUser");
    //   console.log(saveData);
    const respEdit = await edit_query(saveData);
    console.log("Back 1");
    //console.log(respEdit);
    if (respEdit.status == "success") {
      console.log("Success User Updated - Logout");
      const Response = {
        status: "success",
        message: "logout done successfully",
      };
      res.status(200).json(Response);
      //res.status(200).send("DONE");
    } else if (respEdit.status == "error") {
      // console.log("Error");
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
  }
  await updateUser(update_payload);
  //STEP-1 UPDATE DB and make ACESSTOKEN, expiry null--------ends
};
//-------------------------------------------------------------------------------------------------------------
//
module.exports = {
  Logout,
};
