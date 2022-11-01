const express = require("express");
const router = express.Router();
const userController = require("../controllers/loginController");
const { checkEmployeeExists } = require("../models/login");
//console.log("Inside Login.js routes");
//
router.post("/", checkEmployeeExists, userController.Login); //login
//
module.exports = router;
