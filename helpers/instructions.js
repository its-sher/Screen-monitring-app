const con = require("../models/db");

// run_sql(sql_script);
//
//-----------------------------------------------------------------
const add = (tablename, user_payload) => {
  console.log("Inside Add HELPER");
  // console.log(tablename);
  // console.log(user_payload);
  const promise1 = new Promise((resolve, reject) => {
    const sql = con.query(
      "INSERT INTO " + [tablename] + " SET ?",
      [user_payload],
      (err, result) => {
        if (!err) {
          //  console.log(result);
          if (result && result.affectedRows > 0) {
            console.log("Query Success - Add HELPER");
            const LLastID = result.insertId;
            const Response = {
              status: "success",
              id: LLastID,
            };
            resolve(Response);
          }
        } else {
          console.log("Query Error - Add HELPER");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - Add HELPER");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - Add HELPER");
      // console.log(error);
      const Error = {
        status: "error",
        message: error,
      };
      return Error;
    });
  return dd;
};
//-----------------------------------------------------------------
//
// get_data(table_name,{where},orderby);
const view = (tablename, id) => {
  console.log("Inside View HELPER");
  // console.log(tablename);
  // console.log(id);

  const promise1 = new Promise((resolve, reject) => {
    const sql = con.query(
      "SELECT * FROM " + [tablename] + " WHERE id=?",
      [id],
      (err, result) => {
        if (!err) {
          console.log(result);
          if (result && result.length > 0) {
            console.log("Query Success - View HELPER");
            //array is defined and is not empty
            //
            //removing row data packet-------------STARTS
            var resultArray = Object.values(JSON.parse(JSON.stringify(result)));
            //  console.log(resultArray);
            //removing row data packet-------------ENDS
            //
            const Response = {
              status: "success",
              data: resultArray,
            };
            resolve(Response);
          }
        } else {
          console.log("Query Error - View HELPER");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - View HELPER");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - View HELPER");
      // console.log(error);
      const Error = {
        status: "error",
        message: error,
      };
      return Error;
    });
  return dd;
};
//-----------------------------------------------------------------
//
//update(table_name,paypload(),{where});
const edit = (update_payload) => {
  console.log("Inside Edit HELPER");
  // console.log(tablename);
  // console.log(user_payload);
  const promise1 = new Promise((resolve, reject) => {
    // let update_payload = {
    //   table_name = 'users',
    //   query_field = 'email',
    //   query_value = 'j.smith.old@example.com',
    //   dataToSave = {
    //     username: 'j.smith',
    //     user_type: 'job_seeker',
    //     name: 'john smith',
    //     email: 'j.smith.new@example.com',
    //     password: 'keyboard_cat_new',
    //     resume: true,
    //     resume_date_time: '2109-01-01',
    //     salary_expectation: 100000
    //   }
    // };
    const sql = con.query(
      "UPDATE ?? SET ? WHERE ?? = ? ",
      [
        update_payload.table_name,
        update_payload.dataToSave,
        update_payload.query_field,
        update_payload.query_value,
      ],
      (err, result) => {
        if (!err) {
          //  console.log(result);
          if (result && result.affectedRows > 0) {
            console.log("Query Success - Edit HELPER");
            const LLastID = result.insertId;
            const Response = {
              status: "success",
              id: LLastID,
            };
            resolve(Response);
          }
        } else {
          console.log("Query Error - Edit HELPER");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - Edit HELPER");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - Edit HELPER");
      // console.log(error);
      const Error = {
        status: "error",
        message: error,
      };
      return Error;
    });
  return dd;
};
//-----------------------------------------------------------------
//
// delete(table_name,{where});
const deleteHelper = (table_name, id) => {
  console.log("Inside Delete HELPER");
  // console.log(tablename);
  // console.log(user_payload);
  const promise1 = new Promise((resolve, reject) => {
    let update_payload = {
      table_name: table_name,
      query_field: "id",
      query_value: id,
      dataToSave: {
        trash: 1,
      },
    };
    const sql = con.query(
      "UPDATE ?? SET ? WHERE ?? = ? ",
      [
        update_payload.table_name,
        update_payload.dataToSave,
        update_payload.query_field,
        update_payload.query_value,
      ],
      (err, result) => {
        if (!err) {
          console.log(result);
          if (result && result.changedRows > 0) {
            console.log("Query Success - Delete HELPER");
            const Response = {
              status: "success",
            };
            resolve(Response);
          } else {
            reject();
          }
        } else {
          console.log("Query Error - Delete HELPER");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - Delete HELPER");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - Delete HELPER");
      // console.log(error);
      const Error = {
        status: "error",
        message: error,
      };
      return Error;
    });
  return dd;
};
//-----------------------------------------------------------------
//
const errorHelper = async (err) => {
  console.log("Inside Error Helper");
  console.log(err);
  var messageERR;
  var code;
  var f;

  if (err && err !== undefined && Object.keys(err).length != 0) {
    //
    if (err.code == "ER_BAD_FIELD_ERROR") {
      messageERR = err.sqlMessage;
      code = 400;
    } else if (err.code == "ER_NO_DEFAULT_FOR_FIELD") {
      messageERR = err.sqlMessage;
      code = 400;
    } else if (err.code == "ER_DUP_ENTRY") {
      messageERR = err.sqlMessage;
      code = 400;
      // let result = err.sqlMessage.includes("position");
      // if (result == true) {
      //   messageERR = "Position Already Exists";
      //   // const Error = { status: "error", message: messageERR };
      //   // res.status(400).json(Error);
      // } else {
      //   let result1 = err.sqlMessage.includes("name");
      //   if (result1 == true) {
      //     messageERR = "Name Already Exists";
      //     // const Error = { status: "error", message: messageERR };
      //     // res.status(400).json(Error);
      //   }
      // }
    } else {
      messageERR = "Sql Error";
      code = 400;
    }
    f = { message: messageERR, statusCode: code };
    return f;
  } else {
    messageERR = "Sql Error";
    code = 400;
    f = { message: messageERR, statusCode: code };
    return f;
  }
};
//-----------------------------------------------------------------
//
module.exports = { errorHelper, add, view, edit, deleteHelper };
//-----------------------------------------------------------------
//
//*************************************************************************
//*************************************************************************
//*************************************************************************
//*************************************************************************
//
// update(table_name, paypload(), { where });
// delete (table_name, { where });
// get_data(table_name, { where }, orderby);
// run_sql(sql_script);

//old===========================================================
//SELECT
//////////////////////////////////////////////////////////
//ex parameters
// const fields_array = [
//   "id, tax_name, CONCAT(tax_value,' %') as tax_value, country, created_at, updated_at",
// ]; //either send wd values or dont send this parameter
// const tablename = "taxes";
// const WHERE = "id = 1";
// const ORDER_BY = "id DESC";

// async function db_results(
//   tablename,
//   fields_array = null,
//   LEFT_JOIN = null,
//   WHERE = null,
//   ORDER_BY = null
// ) {
//   return new Promise((resolve, reject) => {
//     //optional 2 fields
//     // console.log(LEFT_JOIN);
//     if (tablename) {
//       const values = fields_array != null ? fields_array : "*"; //(comma separate in array)
//       let sql = "SELECT " + values + " FROM " + tablename;
//       console.log(sql);
//       if (LEFT_JOIN) {
//         sql = sql + " LEFT JOIN " + LEFT_JOIN;
//         console.log(sql);
//       }
//       if (WHERE) {
//         sql = sql + " WHERE " + WHERE;
//         console.log(sql);
//         // const WHERE = WHERE != null ? WHERE : "";
//       }
//       if (ORDER_BY) {
//         sql = sql + " ORDER BY " + ORDER_BY;
//         console.log(sql);
//       }
//       //now exceute query and send results
//       con.query(sql, (err, response) => {
//         if (!err) {
//           if (response && response.length) {
//             // console.log(response);
//             var resultArray = Object.values(
//               JSON.parse(JSON.stringify(response))
//             );
//             // console.log(resultArray);
//             // resolve({ [tablename]: resultArray }); //str.split(' ')[0]
//             resolve({ [tablename.split(" ")[0]]: resultArray });
//           } else {
//             const Response = {
//               status: "error",
//               message: "No record in TABLE",
//             };
//             // res.status(204).json(Response);
//             // return Response;
//             reject(Response);
//           }
//         } else {
//           const Response = {
//             status: "error",
//             message: err,
//           };
//           //res.status(400).json(Response);
//           // return Response;
//           reject(Response);
//         }
//       });
//     } else {
//       reject("error");
//     }
//   });
// }

//db_results(tablename, fields_array, WHERE, ORDER_BY);
//////////////////////////////////////////////////////////
// module.exports = { db_results, add };

//  insert

//  INSERT db_insert(tablename, fields_array=null){    //optional 1 fields
//      //check if empty otherwisse throw err
//    const values=(values!=null)? fields_array:'*'; //(comma separate in array)
//       map

//       keys of array
// values array

//       arr length
//       var insertvalues="";
//       for(i=0,i<arr.length,i++){

//           if(i=0){
// insertvalues =fields_array keyarray +"='"+valuearray+"'"
//           }else{
//               insertvalues =insertvalues+","+fields_array keyarray +"='"+valuearray+"'" //concat
//           }
//       }
//       //value= key +"='"+value+"'"            (comma separate)
// INSERT INTO tablename +values
// }

//  update              set  where

//   del
//old===========================================================
