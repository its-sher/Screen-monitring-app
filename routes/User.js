const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkemployee, checkemployeealready } = require("../models/user");
console.log("Inside User.js routes");
//
router.post("/", checkemployeealready, userController.CreateUser); //ADD

router.get("/single/:id", checkemployee, userController.GetUserById); //VIEW
router.put(
  "/update/:id",
  checkemployee,
  checkemployeealready,
  userController.UpdateUser
); //EDIT
router.delete("/delete/:id", checkemployee, userController.DeleteUser); //DELETE
//
//---------------------------------------------------------------------------------
router.get(
  "/verify/:id",
  checkemployee,
  userController.AccountVerificationCode
); //email and account verification done via single email
//3
router.get(
  "/verificationcode/:id",
  checkemployee,
  userController.VerificationCode
); // for all other verifications
//4
router.get("/forgotpassword/:id", checkemployee, userController.ForgotPassword); //forgot password otp email
////---------------------------------------------------------------------------------
//
router.post("/verifyotp/:id", checkemployee, userController.VerifyOtp);
router.put("/passwordupdate/:id", checkemployee, userController.PasswordUpdate);
//
module.exports = router;
