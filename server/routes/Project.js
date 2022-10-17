const express = require("express");
const router = express.Router();
const userController = require("../controllers/projectController");
const { checkProject } = require("../models/project");
//console.log("Inside Project.js routes");
//
router.post("/", userController.CreateProject);
router.get("/:id", userController.GetProject);
router.put("/:id", userController.UpdateProject);
router.delete("/:id", checkProject, userController.DeleteProject);
//
module.exports = router;
