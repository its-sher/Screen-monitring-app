const express = require("express");
const router = express.Router();
const userController = require("../controllers/roleController");
const { checkrole } = require("../models/role");
//
router.get("/:id", userController.GetRoleById);
router.post("/", userController.CreateRole);
router.put("/:id", userController.UpdateRoleById);
router.delete("/:id", checkrole, userController.DeleteRoleById);
//
module.exports = router;
