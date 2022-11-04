const express = require("express");
const router = express.Router();
const roleCtrl = require("../controllers/roleController");
//const { checkrole } = require("../models/role");
//
router.get("/:id", roleCtrl.Roles);
router.get("/", roleCtrl.Roles);
router.get("/parent/:id", roleCtrl.RolesByParent);
router.delete("/:id", roleCtrl.Delete); //checkrole,
router.delete("/trash/:id", roleCtrl.Trash); //checkrole
router.post("/", roleCtrl.CreateRole);
//
//
//router.put("/:id", userController.UpdateRoleById);
//
module.exports = router;

//all no query string
