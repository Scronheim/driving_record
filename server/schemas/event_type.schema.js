const mongoose = require("mongoose")

const eventTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const EventType = mongoose.model('event_types', eventTypeSchema, 'event_types')

module.exports = EventType
