const con = require("./db");
///////////////////////////////////MIDDLEWARES//////////////////////////////////////////////////////
//
//--------------------------------------------------------------------------------------------------
//CHECK IF USER exists EXISTS OR NOT - --
const checkEmployeeExists = (req, res, next) => {
  console.log("---checkEmployeeExists Middleware---");
  //
  const data = req.body;
  // console.log(data);
  let filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([_, v]) => v != "null" && v != "" && v != null && v != null
    )
  );
  // console.log(filteredData);
  //---------------------------------------------------------------
  if (filteredData.hasOwnProperty("email") && filteredData.email.length > 0) {
    console.log("Valid Details Middleware");
    //
    const email = filteredData.email;
    //
    const sql1 = con.query(
      "SELECT u.id from employee as u  WHERE u.email=?",
      //LEFT JOIN users_role as ur ON u.id=ur.users_id
      [email],
      (err, response) => {
        //console.log(response);
        if (!err) {
          if (response && response.length > 0) {
            console.log("Email exists");
            next();
          } else {
            //no email found
            console.log("No-record-Middleware");
            const Error = {
              status: "error",
              message:
                "Email doesnot assosciates with any account. Please Register First",
            };
            res.status(403).json(Error);
          }
        } else {
          console.log("Middleware Error");
          console.log(err);
          const Error = { status: "error", message: "Server Error" };
          res.status(400).json(Error);
        }
      }
    );
    console.log(sql1.sql);
    //
  } else {
    console.log("Invalid Details Middleware");
    const Error = {
      status: "error",
      message:
        "Email doesnot assosciates with any account. Please Register First",
    };
    res.status(403).json(Error);
  }
};
//--------------------------------------------------------------------------------------------
//

//--------------------------------------------------------------------------------------------
module.exports = {
  checkEmployeeExists,
  //
};
