const mongoose = require("mongoose")

const eventStatusSchema = new mongoose.Schema({
  name: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const EventStatus = mongoose.model('event_statuses', eventStatusSchema, 'event_statuses')

module.exports = EventStatus
