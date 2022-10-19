const express = require("express");
const router = express.Router();
const userController = require("../controllers/loginController");
//console.log("Inside Login.js routes");
//
router.post("/", userController.Login); //login
//
module.exports = router;
