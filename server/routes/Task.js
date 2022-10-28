const express = require("express");
const router = express.Router();
const userController = require("../controllers/taskController");
const { checktask } = require("../models/task");
//console.log("Inside Task.js routes");
//
router.post("/", userController.CreateTask);
router.get("/:id", userController.GetTasks);
router.put("/:id", userController.UpdateTask);
router.delete("/:id", checktask, userController.DeleteTask);
//
//---------------------------------------------------------------------------------
module.exports = router;
