const express = require("express");
const router = express.Router();
const userController = require("../controllers/moduleController");
const { checkmodule } = require("../models/module");
//
router.get("/?", userController.GetModules);
router.post("/", userController.CreateModule);
router.put("/:id", userController.UpdateModuleById);
router.delete("/:id", checkmodule, userController.DeleteModuleById);

module.exports = router;
