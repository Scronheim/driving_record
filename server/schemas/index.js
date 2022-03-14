const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.car = require("./car.schema")
db.school = require("./school.schema")
db.schoolGroup = require("./school_group.schema")
db.instructor = require("./instructor.schema")
db.student = require("./student.schema")
db.role = require("./role.schema")
db.event = require("./event.schema")
db.paymentType = require("./payment_type.schema")

db.ROLES = ["user", "admin", "moderator"]

module.exports = db
