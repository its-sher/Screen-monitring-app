var moment = require("moment");
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES; //8000

const {
  add_query,
  view_query,
  edit_query,
  error_query,
  //deleteHelper,
  trash_query,
} = require("./../helpers/instructions");
const { ExtractToken } = require("../ApiMiddleware");
const table_name = "employee";

//VALIDATE ACCESS TOKEN FOR logout URL-------------------------------------------------------------------STARTS
const GenuineTokenLogout = async (req, res, next) => {
  //console.log("Inside GenuineToken middleware");
  //console.log(req.headers);
  const basic_auth = req.headers.token;
  //console.log(basic_auth); //Bearer YzAxMjM0YjEtMTBiMS00NWY4LWFjZGMtYTQ2M2Q2ZTYyMzFjMmRkZDk5ZmE0NGU1NjhiNGI4MmVmM2MzZjNiZTJmMjI=
  const access_token = await ExtractToken(basic_auth);
  //console.log(access_token);
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
          next();
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
//VALIDATE ACCESS TOKEN FOR logout URL-------------------------------------------------------------------ENDS
//
module.exports = { GenuineTokenLogout };
//--------------------------------------------------------------------------------------------
