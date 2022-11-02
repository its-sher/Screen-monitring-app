const express = require("express");
const router = express.Router();
const userController = require("../controllers/moduleController");
//
//
router.get("/?", userController.GetModules);
router.delete("/:id", userController.DeleteModuleById);

router.post("/", userController.CreateModule);
router.put("/:id", userController.UpdateModuleById);

module.exports = router;
