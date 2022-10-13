const con = require("../models/db");

// run_sql(sql_script);
//
//-----------------------------------------------------------------
const add = (add_payload) => {
  console.log("Inside Add HELPER");
  //customUrlFields--------------------------------------------
  // let add_payload = {
  //   sql_script:
  //     "INSERT INTO configuration (config_key, config_value) VALUES ?",
  //   sql_values: arr,
  // };
  //
  //OR
  //normal--------------------------------------------
  // let add_payload = {
  //   table_name: table_name,
  //   query_field: "id",
  //   query_value: id,
  //   dataToSave: {
  //     trash: 1,
  //   },
  // };
  const promise1 = new Promise((resolve, reject) => {
    var sqll;
    var params;
    var normal = 0;
    var customUrlFields = 0;
    console.log(add_payload);
    if (
      add_payload.sql_script &&
      add_payload.sql_script.length > 0 &&
      //
      add_payload.sql_values &&
      add_payload.sql_values.length > 0
    ) {
      console.log("Custom Url And FIELDS");
      customUrlFields = 1;
    } else if (
      add_payload.table_name &&
      add_payload.table_name.length > 0 &&
      //
      add_payload.dataToSave &&
      add_payload.dataToSave !== undefined &&
      Object.keys(add_payload.dataToSave).length != 0
    ) {
      console.log("Normal Insert");
      normal = 1;
    } else {
      const Error = {
        code: "INVALID_SQL_PARAMS",
        sqlMessage: "Invalid Sql Params",
      };
      reject(Error);
    }

    if (normal == 1) {
      sqll = "INSERT INTO " + [add_payload.table_name] + " SET ?";
      params = [add_payload.dataToSave];
    } else if (customUrlFields == 1) {
      sqll = add_payload.sql_script;
      params = [add_payload.sql_values];
    }

    const sql = con.query(sqll, params, (err, result) => {
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
        } else {
          console.log("Nothing Updated - Add HELPER ");
          reject();
        }
      } else {
        console.log("Query Error - Add HELPER");
        reject(err);
      }
    });
    console.log(sql.sql);
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
const view = (view_payload) => {
  console.log("Inside View HELPER");
  // console.log(view_payload);
  // let view_payload = {
  //   table_name: table_name,
  //   query_field: "id",
  //   query_value: id,
  //   dataToGet: {
  //     trash: 1,
  //   },
  // };
  const promise1 = new Promise((resolve, reject) => {
    var sqll;
    var nameAndGet = 0;
    var queryAndValue = 0;
    if (
      view_payload.table_name &&
      view_payload.table_name.length > 0 &&
      view_payload.dataToGet &&
      view_payload.dataToGet.length > 0
    ) {
      nameAndGet = 1;
      if (
        view_payload.query_field &&
        view_payload.query_field.length > 0 &&
        view_payload.query_value
      ) {
        queryAndValue = 1;
      }
    } else {
      const Error = {
        code: "INVALID_SQL_PARAMS",
        sqlMessage: "Invalid Sql Params",
      };
      reject(Error);
    }

    if (queryAndValue == 1) {
      sqll = "SELECT " + [view_payload.dataToGet] + " FROM ?? WHERE ?? = ?";
      params = [
        view_payload.table_name,
        view_payload.query_field,
        view_payload.query_value,
      ];
    } else if (nameAndGet == 1) {
      sqll = "SELECT " + [view_payload.dataToGet] + " FROM ??";
      params = [view_payload.table_name];
    }

    const sql = con.query(sqll, params, (err, result) => {
      if (!err) {
        //console.log(result);
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
        } else {
          console.log("No Data - View HELPER ");
          const Error = {
            code: "NO_DATA",
            sqlMessage: "No Data",
          };
          reject(Error);
        }
      } else {
        console.log("Query Error - View HELPER");
        reject(err);
      }
    });
    console.log(sql.sql);
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
          } else {
            console.log("Nothing Updated - Edit HELPER ");
            reject();
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
const deleteTrashHelper = (delete_payload) => {
  console.log("Inside deleteTrashHelper");
  // console.log(delete_payload);
  // let delete_payload = {
  //   table_name: table_name,
  //   query_field: "id",
  //   query_value: id,
  // dataToSave: {
  //   active: 0,
  //   trash: 1,
  // },
  // };
  const promise1 = new Promise((resolve, reject) => {
    const sql = con.query(
      "UPDATE ?? SET ? WHERE ?? = ? ",
      [
        delete_payload.table_name,
        delete_payload.dataToSave,
        delete_payload.query_field,
        delete_payload.query_value,
      ],
      (err, result) => {
        if (!err) {
          console.log(result);
          if (result && result.changedRows > 0) {
            console.log("Query Success - deleteTrashHelper");
            const Response = {
              status: "success",
            };
            resolve(Response);
          } else {
            console.log("Nothing Trashed - deleteTrashHelper ");
            reject();
          }
        } else {
          console.log("Query Error - deleteTrashHelper");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - deleteTrashHelper");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - deleteTrashHelper");
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
const deleteHelper = (delete_payload) => {
  console.log("Inside deleteHelper");
  // console.log(delete_payload);
  // let delete_payload = {
  //   table_name: table_name,
  //   query_field: "id",
  //   query_value: id,
  // };
  const promise1 = new Promise((resolve, reject) => {
    const sql = con.query(
      "DELETE FROM ?? WHERE ?? = ?",
      [
        delete_payload.table_name,
        delete_payload.query_field,
        delete_payload.query_value,
      ],
      (err, result) => {
        console.log(result);
        if (typeof result === "undefined") {
          console.log("Not Permitted to Delete");
          const Error = {
            code: "NOT_PERMITTED_TO_DELETE",
            sqlMessage: "Not Permitted to Delete",
          };
          reject(Error);
        } else if (!err) {
          if (result && result.affectedRows > 0) {
            console.log("Query Success - deleteHelper");
            const Response = {
              status: "success",
            };
            resolve(Response);
          } else {
            console.log("Nothing Deleted - deleteHelper ");
            reject();
          }
        } else {
          console.log("Query Error - deleteHelper");
          reject(err);
        }
      }
    );
    // console.log(sql.sql);
  });
  const dd = promise1
    .then((value) => {
      console.log("promise done - deleteHelper");
      //console.log(value);
      return value;
    })
    .catch((error) => {
      console.log("Catch Error - deleteHelper");
      console.log(error);
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
    if (err.code == "NO_DATA") {
      messageERR = err.sqlMessage;
      code = 204;
    } else if (err.code == "INVALID_SQL_PARAMS") {
      messageERR = err.sqlMessage;
      code = 400;
    } else if (err.code == "ER_EMPTY_QUERY") {
      messageERR = err.sqlMessage;
      code = 400;
    } else if (err.code == "NOT_PERMITTED_TO_DELETE") {
      messageERR = err.sqlMessage;
      code = 400;
    } else if (err.code == "ER_BAD_FIELD_ERROR") {
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
      //   // const Error = { status: "error", messuser_payloadage: messageERR };
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
module.exports = {
  errorHelper,
  add,
  view,
  edit,
  deleteHelper,
  deleteTrashHelper,
};
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
