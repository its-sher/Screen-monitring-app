const con = require("../models/db");
//const moment = require("moment");

// Get all blocked_ips from database table --blocked_ip-DONE--------------------------------------------------------------
const GetAllBlockedIps = (req, res) => {
  con.query(
    "SELECT id, sessions_id, ipaddress, status, created_at, updated_at from blocked_ip",
    (err, response) => {
      if (!err) {
        if (response && response.length) {
          //array is defined and is not empty
          const Response = {
            status: "success",
            data: { blocked_ips: response },
          };
          res.status(200).json(Response);
        } else {
          const Response = {
            status: "error",
            message: "no data in database",
          };
          res.status(204).json(Response);
        }
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//-------------------------------------------------------------------------------------------------------------
//Get a blocked_ip by id --DONE-------------------------------------------------------------------------------
const GetBlockedIpById = (req, res) => {
  // console.log(req.params.id);
  const orderId = req.params.id;
  con.query(
    "SELECT id, sessions_id, ipaddress, status, created_at, updated_at from blocked_ip WHERE id=?",
    [orderId],
    (err, response) => {
      if (!err) {
        if (response && response.length) {
          //array is defined and is not empty
          const Response = {
            status: "success",
            data: { blocked_ip: response },
          };
          res.status(200).json(Response);
        } else {
          const Response = {
            status: "error",
            message: "no data in database",
          };
          res.status(204).json(Response);
        }
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//-----------------------------------------------------------------------------------------------------------
// Add a blocked_ip  into database table --blocked_ip-DONE--------------------------------------------------------------
const CreateBlockedIp = (req, res) => {
  const params = req.body;
  // console.log(params);

  /* //inserting created_at key-value pair to params object
  var mysqlTimestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  //console.log(mysqlTimestamp);
  params["created_at"] = mysqlTimestamp;
  //console.log(params);
 */

  con.query("INSERT INTO blocked_ip SET ?", [params], (err, result) => {
    if (!err) {
      //res.json("Registered Successfully");

      //1--finding id of last record inserted and then finding that data from mysql and sending that data to url to show inpostman
      const LastID = result.insertId;
      // console.log(LastID);
      con.query(
        "SELECT id, sessions_id, ipaddress, status, created_at, updated_at from blocked_ip WHERE id=?",
        [LastID],
        (err, response) => {
          if (!err) {
            const Response = {
              status: "success",
              data: { blocked_ip: response },
            };
            res.status(201).json(Response);
          } else {
            console.log(err);
            const Error = { status: "error", message: "Server Error" };
            res.status(400).json(Error);
          }
        }
      );
    } else {
      console.log(err);
      const Error = { status: "error", message: "Server Error" };
      res.status(400).json(Error);
    }
  });
};

//-----------------------------------------------------------------------------------------------------------------
// UPDATE a blocked_ip  in database table --blocked_ip----------------------------------------------------
const UpdateBlockedIpById = (req, res) => {
  const params = req.body;
  const refundId = req.params.id;
  // console.log(params);
  // const type = typeof params;
  // console.log(type);

  con.query(
    "UPDATE blocked_ip SET ? WHERE id=?",
    [params, refundId],
    (err, result) => {
      if (!err) {
        //res.json("Updated Successfully");
        //1--START- FETCHING data by id of record updated
        con.query(
          "SELECT id, sessions_id, ipaddress, status, created_at, updated_at from blocked_ip WHERE id=?",
          [refundId],
          (err, response) => {
            if (!err) {
              const Response = {
                status: "success",
                data: { blocked_ip: response },
              };
              res.status(200).json(Response);
            } else {
              console.log(err);
              const Error = { status: "error", message: "Server Error" };
              res.status(400).json(Error);
            }
          }
        );
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//-----------------------------------------------------------------------------------------------------------------
// DELETE a blocked_ip in database table --blocked_ip--------------------------------------------------
const DeleteBlockedIpById = (req, res) => {
  const refundId = req.params.id;
  const sql = con.query(
    "DELETE FROM blocked_ip WHERE id=?",
    [refundId],
    (err, response) => {
      if (typeof response === "undefined") {
        const Response = {
          data: { message: "Not Permitted to Delete" },
        };
        res.status(204).json(Response);
      } else if (!err) {
        if (response && response.affectedRows > 0) {
          const Response = {
            status: "success",
            data: { message: "blocked_ip deleted successfully" },
          };
          res.status(200).json(Response);
        } else {
          console.log(err);
          const Error = { status: "error", message: "Server Error" };
          res.status(400).json(Error);
        }
      } else {
        console.log(err);
        const Error = { status: "error", message: "Server Error" };
        res.status(400).json(Error);
      }
    }
  );
};
//-----------------------------------------------------------------------------------------------------------------
module.exports = {
  GetAllBlockedIps,
  GetBlockedIpById,
  CreateBlockedIp,
  UpdateBlockedIpById,
  DeleteBlockedIpById,
};
