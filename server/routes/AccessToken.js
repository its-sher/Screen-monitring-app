const express = require("express");
const router = express.Router();
const userController = require("../controllers/accesstokenController");
//console.log("Inside AccessToken.js routes");
//
router.post("/", userController.CreateAccessRefreshToken); //ADD
router.get("/", userController.RegenerateAccessToken);

module.exports = router;
