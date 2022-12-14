const express = require("express");
const router = express.Router();
const userController = require("../controllers/employeeController");
const { checkemployee, checkemployeealready } = require("../models/employee");
//console.log("Inside Employee.js routes");
//
router.post("/", userController.CreateEmployee);
router.get("/:id", userController.GetEmployees);
router.put(
  "/:id",
  //checkemployeealready,
  userController.UpdateEmployee
);
router.delete("/:id", checkemployee, userController.DeleteEmployee);
//
//---------------------------------------------------------------------------------
//pending---------------
router.get("/forgotpassword/:id", checkemployee, userController.ForgotPassword); //forgot password otp email
router.post("/validate/", checkemployee, userController.VerifyOtp);
router.put("/passwordupdate/:id", checkemployee, userController.PasswordUpdate);
//pending---------------
//
module.exports = router;
