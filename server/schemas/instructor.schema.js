const mongoose = require("mongoose")

const instructorSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  car: {
    type: mongoose.Types.ObjectId,
  },
  school: {
    type: mongoose.Types.ObjectId,
  },
  role: {
    type: mongoose.Types.ObjectId,
  },
  phone: {
    type: String,
  },
  disabled: {
    type: Boolean,
  }
}, {
  versionKey: false,
  timestamps: true,
})

const Instructor = mongoose.model('instructors', instructorSchema, 'instructors')

module.exports = Instructor
