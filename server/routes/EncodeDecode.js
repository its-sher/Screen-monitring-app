const express = require("express");
const router = express.Router();
const userController = require("../controllers/encodedecodeController");

router.get("/encrypt/:id", userController.EncryptId);
router.get("/decode/:id", userController.DecodeId);

module.exports = router;
