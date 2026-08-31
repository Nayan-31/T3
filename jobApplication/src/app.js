let express = require('express')
let cookieParser = require('cookie-parser')
let authroutes = require('../src/routes/auth.route')
let applicationRoutes = require('../src/routes/application.routes')
let dashboardRoutes = require('../src/routes/dashboard.routes')

let app = express()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth' , authroutes)
app.use('/api/application' , applicationRoutes)
app.use('/api/dashboard' , dashboardRoutes)

module.exports = app
