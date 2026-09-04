const express = require("express");

const {
  createBoard,
  getBoard,
  getBoards,
  updateBoard,
  deleteBoard
} = require("../controllers/board.controller");

const protect = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.post("/", createBoard);

router.get("/", getBoards);

router.get("/:boardId", getBoard);

router.patch("/:boardId", updateBoard);

router.delete("/:boardId", deleteBoard);

module.exports = router;