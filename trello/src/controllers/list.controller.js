const List = require("../models/List.model");
const Board =  require("../models/Board.model");

const createList = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "List title is required",
      });
    }

    const board = await Board.findById(boardId);

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

    const count = await List.countDocuments({
      boardId,
    });

    const list = await List.create({
      title: title.trim(),
      boardId,
      position: count,
    });

    return res.status(201).json({
      list,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

const updateList = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title } = req.body;

    // 1. New title valid hai?
    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "List title is required",
      });
    }

    // 2. List exist karti hai?
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    // 3. Ye list kis board ki hai?
    const board = await Board.findById(list.boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // 4. Current user member hai?
    const isMember = board.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You cannot update this list",
      });
    }

    // 5. Title change
    list.title = title.trim();

    // 6. Database me save
    await list.save();

    return res.status(200).json({
      message: "List updated successfully",
      list,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteList = async (req, res) => {
  try {
    const { listId } = req.params;

    // 1. List find karo
    const list = await List.findById(listId);

    if (!list) {
      return res.status(404).json({
        message: "List not found",
      });
    }

    // 2. List kis board ki hai?
    const board = await Board.findById(list.boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    // 3. Current user member hai?
    const isMember = board.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You cannot delete this list",
      });
    }

    // 4. Is list ke andar ke saare cards delete
    await Card.deleteMany({
      listId: list._id,
    });

    // 5. List delete
    await list.deleteOne();

    return res.status(200).json({
      message: "List deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


module.exports = {
  createList,
  updateList,
  deleteList,
};