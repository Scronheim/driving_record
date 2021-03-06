const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema({
  address: {
    type: String,
  },
  groups: [
    {
      type: mongoose.Types.ObjectId
    }
  ],
}, {
  versionKey: false,
  timestamps: true,
})

const School = mongoose.model('schools', schoolSchema, 'schools')

module.exports = School
