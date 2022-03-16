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
    type: Number, // timestamp
  },
  end: {
    type: Number, // timestamp
  },
  timed: {
    type: Boolean,
  },
  cost: {
    type: Number,
  },
  status: {
    type: mongoose.Types.ObjectId
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Event = mongoose.model('events', eventSchema, 'events')

module.exports = Event
