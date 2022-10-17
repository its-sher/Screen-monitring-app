const express = require("express");
const router = express.Router();
const userController = require("../controllers/clientController");
const { checkClient } = require("../models/client");
//console.log("Inside Client.js routes");
//
router.post("/", userController.CreateClient);
router.get("/:id", userController.GetClient);
router.put("/:id", userController.UpdateClient);
router.delete("/:id", checkClient, userController.DeleteClient);
//
module.exports = router;
