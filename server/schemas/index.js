const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.car = require("./car.schema")
db.school = require("./school.schema")
db.user = require("./user.schema")
db.role = require("./role.schema")
db.event = require("./event.schema")

db.ROLES = ["user", "admin", "moderator"]

module.exports = db
