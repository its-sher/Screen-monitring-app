const express = require("express");
const router = express.Router();
const userController = require("../controllers/blockedipController");

router.get("/", userController.GetAllBlockedIps);
router.get("/:id", userController.GetBlockedIpById);
router.post("/", userController.CreateBlockedIp);
router.put("/:id", userController.UpdateBlockedIpById);
router.delete("/:id", userController.DeleteBlockedIpById);

module.exports = router;
