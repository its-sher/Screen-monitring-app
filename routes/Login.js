const express = require("express");
const router = express.Router();
const userController = require("../controllers/loginController");
console.log("Inside Login.js routes");
//
router.post("/", userController.LoginUser); //login user
router.get("/session", userController.GetUserLoggedinId); //get id of user who is login
router.get("/data", userController.CheckIfUserLoggedIn); //check logged in or not
router.get("/logout", userController.Logout); //log out
//
module.exports = router;
