const Board =  require("../models/Board.model");
const List = require("../models/List.model");

const createCard = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description = "" } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Card title is required",
      });
    }

    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    const board = await Board.findById(list.boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const isMember = board.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const count = await Card.countDocuments({
      listId,
    });

    const card = await Card.create({
      title: title.trim(),
      description,
      boardId: list.boardId,
      listId,
      position: count,
    });

    return res.status(201).json({
      message: "Card created successfully",
      card,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
    createCard
}