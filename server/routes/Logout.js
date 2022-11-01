const express = require("express");
const router = express.Router();
const userController = require("../controllers/logoutController");
const { GenuineTokenLogout } = require("../helpers/logout");
//console.log("Inside Logout.js routes");
//
router.get("/", GenuineTokenLogout, userController.Logout); //logout
//
module.exports = router;
