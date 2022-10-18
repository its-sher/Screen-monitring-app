const express = require("express");
const router = express.Router();
const userController = require("../controllers/attachmentsController");
//
console.log("Inside Image.js routes");
router.post("/employee/:id", userController.Employee); //single
router.post("/project/:id", userController.Project); //multiple
router.post("/logs/:id", userController.Logs); //multiple
//
module.exports = router;
