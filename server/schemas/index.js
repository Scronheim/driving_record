const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {}

db.mongoose = mongoose
db.school = require("./school.schema")
db.user = require("./user.schema")
db.role = require("./role.schema")
db.event = require("./event.schema")
db.paymentType = require("./payment_type.schema")
db.eventType = require("./event_type.schema")
db.eventStatus = require("./event_status.schema")

module.exports = db
