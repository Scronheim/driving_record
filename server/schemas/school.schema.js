const mongoose = require("mongoose")

const schoolSchema = new mongoose.Schema({
  address: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Car = mongoose.model('schools', schoolSchema, 'schools')

module.exports = Car
