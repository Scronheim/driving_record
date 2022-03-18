const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  school: {
    type: mongoose.Types.ObjectId,
  },
  start: {
    type: Number,
  },
  end: {
    type: Number,
  },
  students: {
    type: Array,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Group = mongoose.model('groups', groupSchema, 'groups')

module.exports = Group
