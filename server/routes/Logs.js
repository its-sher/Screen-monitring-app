const express = require("express");
const router = express.Router();
const userController = require("../controllers/logsController");
const { checkLog } = require("../models/logs");
//console.log("Inside Logs.js routes");
//
router.post("/", userController.CreateLog);
router.get("/:id", userController.GetLog);
router.put("/:id", userController.UpdateLog);
router.delete("/trash/:id", checkLog, userController.TrashLog);
router.delete("/:id", checkLog, userController.DeleteLog);
//
module.exports = router;
