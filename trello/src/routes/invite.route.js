const express = require("express");

const {
  createInvite,
  acceptInvite,
} = require("../controllers/invite.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/:boardId", createInvite);

router.post("/:token/accept", acceptInvite);

module.exports = router;