const express = require("express");
const router = express.Router();
const userController = require("../controllers/logoutController");
//console.log("Inside Logout.js routes");
//
router.get("/", userController.Logout); //logout
//
module.exports = router;
