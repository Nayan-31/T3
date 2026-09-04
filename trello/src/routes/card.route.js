const express = require("express");

const {
  createCard,
  updateCard,
  deleteCard,
  moveCard,
} = require("../controllers/card.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/:listId", createCard);

router.patch("/:cardId", updateCard);

router.delete("/:cardId", deleteCard);

router.patch("/:cardId/move", moveCard);

module.exports = router;