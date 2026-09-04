let express = require('express')
let cookieParser = require('cookie-parser')
const authRoutes = require("../src/routes/auth.route");
const boardRoutes = require("../src/routes/board.route");
const listRoutes = require("../src/routes/list.route");
const cardRoutes = require("../src/routes/card.route");
const inviteRoutes = require("../src/routes/invite.route");
let app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes);

app.use("/api/boards", boardRoutes);

app.use("/api/lists", listRoutes);

app.use("/api/cards", cardRoutes);

app.use("/api/invites", inviteRoutes);

module.exports = app
