const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
  type: {
    type: mongoose.Types.ObjectId,
    ref: 'event_types',
    autopopulate: true,
  },
  instructor: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    autopopulate: true,
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    autopopulate: true,
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
    required: false,
    type: Number,
  },
  status: {
    required: false,
    type: mongoose.Types.ObjectId,
    ref: 'event_statuses',
    autopopulate: true,
  },
}, {
  versionKey: false,
  timestamps: true,
})
eventSchema.plugin(require('mongoose-autopopulate'))
const Event = mongoose.model('events', eventSchema, 'events')

module.exports = Event
