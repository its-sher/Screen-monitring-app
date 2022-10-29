const con = require("./models/db");
var moment = require("moment");
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES; //8000

const {
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("./helpers/instructions");
const table_name = "employee";

//VALIDATE ACCESS TOKEN FOR EACH URL---------------------------------------------------------
const GenuineToken = async (req, res, next) => {
  //console.log("Inside GenuineToken middleware");
  // console.log(req.headers);
  const access_token = req.headers.token;
  // console.log(access_token);
  //STEP-1 -------------------------------CHECK ACCESS TOKEN THERE OR NOT-------------------starts
  if (!access_token) {
    console.log("No Access Token");
    const Error = {
      error: "Url Forbidden!",
    };
    return res.status(403).json(Error);
  } else {
    //STEP-2 -------------------------------CHECK ACCESS TOKEN EXISTS IN DB AND GET DATA-------------------STARTS
    async function getDataFunc(access_token) {
      //console.log("Inside getDataFunc");
      //
      const view_payload = {
        table_name: table_name,
        dataToGet: "id, access_token, access_token_expires_in",
        query_field: "access_token",
        query_value: access_token,
      };
      //console.log(view_payload);
      //
      const respView = await view_query(view_payload);
      console.log("Back 1");
      //console.log(respView);
      if (respView.status == "success") {
        //console.log("Success employee Data Got");
        //console.log(respView);
        const time_db = respView.data[0].access_token_expires_in;
        //console.log(time_db);
        var dateTimeThen = new moment(time_db);
        //console.log(dateTimeThen);
        var dateTimeNow = new moment(); //present time
        //console.log(dateTimeNow);
        var difference = moment.duration(dateTimeNow.diff(dateTimeThen));
        //var difference = moment.duration(dateTimeThen.diff(dateTimeNow));
        var diffinmilli = difference._milliseconds;
        //console.log(diffinmilli);
        //console.log(ACCESS_TOKEN_EXPIRES);
        //STEP-3 CHECK ACCESS TOKEN EXPIRY VALID---------------------STARTS
        if (diffinmilli > ACCESS_TOKEN_EXPIRES) {
          console.log("Access Token Expired");
          const Error = {
            status: "error",
            message: "Access Token Expired!!",
          };
          res.status(403).json(Error);
        } else {
          console.log("Access Token Valid - Middleware Passed");
          //STEP-4 UPDATE NEW ACESSTOKENEXPIRY TIME IN DB--------starts
          const accesstokenexpiry = moment().add(1, "hours");
          const userId = respView.data[0].id;
          //console.log(userId);
          let update_payload = {
            table_name: table_name,
            query_field: "id",
            query_value: userId,
            dataToSave: {
              access_token_expires_in: accesstokenexpiry,
            },
          };
          //console.log(update_payload);
          async function updateUser(saveData) {
            //  console.log("Inside updateUser");
            //   console.log(saveData);
            const respEdit = await edit_query(saveData);
            console.log("Back 2");
            //console.log(respEdit);
            if (respEdit.status == "success") {
              console.log("Success User Updated");
              return next();
              //
            } else if (respEdit.status == "error") {
              // console.log("Error");
              const err = respEdit.message;
              const respError = await error_query(err);
              console.log("Back 2-E");
              //  console.log(respError);
              const Error = {
                status: "error",
                message: respError.message,
              };
              res.status(respError.statusCode).json(Error);
            }
          }
          await updateUser(update_payload);
          //STEP-4 UPDATE NEW ACESSTOKENEXPIRY TIME IN DB--------ends
        }
        //STEP-3 CHECK ACCESS TOKEN EXPIRY VALID---------------------ENDS
      } else if (respView.status == "error") {
        //console.log("Error");
        const err = respView.message;
        //{ code: 'NO_DATA', sqlMessage: 'No Data' }
        if (err.code == "NO_DATA") {
          const Error = {
            error: "Forbidden!! UnAuthorized Access!!",
          };
          return res.status(403).json(Error);
        } else {
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
    }
    await getDataFunc(access_token);
    //STEP-2 -------------------------------CHECK ACCESS TOKEN EXISTS IN DB AND GET DATA-------------------ENDS
  }
  //STEP-1 -------------------------------CHECK ACCESS TOKEN THERE OR NOT-------------------ends
};
module.exports = { GenuineToken };
//--------------------------------------------------------------------------------------------
