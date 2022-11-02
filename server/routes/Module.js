const express = require("express");
const router = express.Router();
const userController = require("../controllers/moduleController");
//
router.get("/?", userController.GetModules);
router.post("/", userController.CreateModule);
router.put("/:id", userController.UpdateModuleById);
router.delete("/:id", userController.DeleteModuleById);

module.exports = router;
