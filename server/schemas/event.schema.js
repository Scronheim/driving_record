const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  type: {
    type: mongoose.Types.ObjectId,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
  },
  student: {
    type: mongoose.Types.ObjectId,
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  name: {
    type: String,
  },
  timed: {
    type: Boolean,
  },
  color: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Event = mongoose.model('events', eventSchema, 'events')

module.exports = Event
