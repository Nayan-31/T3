const Board =  require("../models/Board.model");
const List = require("../models/List.model");
const Card = require("../models/Card.model");
const Invite = require("../models/Invite.model");
async function createBoard(req, res) {
  try {
    const { title } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Board title is required",
      });
    }

    const board = await Board.create({
      title: title.trim(),
      owner: req.user._id,
      members: [req.user._id],
    });

    return res.status(201).json({
      board,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBoards(req, res) {
  try {
    const boards = await Board.find({
      members: req.user._id,
    });

    return res.status(200).json({
      boards,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getBoard(req, res) {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    const isMember = board.members.some(
      (memberId) =>
        memberId.toString() === req.user._id.toString() //current logged-in user, kya is board ke members me hai? some() = array me ek bhi item condition satisfy kare toh true
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.status(200).json({
      board,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateBoard(req, res) {
  try {
    const { boardId } = req.params;
    const { title } = req.body;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    if (
      board.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only owner can update board",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Title cannot be empty",
        });
      }

      board.title = title.trim();
    }

    await board.save();

    return res.status(200).json({
      board,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

//deleteMany() aur deleteOne() kyun? 
// Card.deleteMany(...) --> Because ek board ke multiple cards ho sakte hain
// multiple lists: List.deleteMany(...)
// multiple invites: Invite.deleteMany(...)
// Lekin board variable me humne ek particular board nikala tha: const board = await Board.findById(boardId);  isliye : board.deleteOne();
async function deleteBoard(req, res) {
  try {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
      return res.status(404).json({
        message: "Board not found",
      });
    }

    if (
      board.owner.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only owner can delete board",
      });
    }

    await Card.deleteMany({ boardId });
    await List.deleteMany({ boardId });
    await Invite.deleteMany({ boardId });
    await board.deleteOne();

    return res.status(200).json({
      message: "Board deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createBoard,
  getBoard,
  getBoards,
  updateBoard,
  deleteBoard
}