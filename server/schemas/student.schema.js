const mongoose = require("mongoose")

const studentsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
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
  },
  payments: [
    {
      date: {
        type: Date,
      },
      type: {
        type: mongoose.Types.ObjectId
      },
      sum: Number,
    }
  ],
}, {
  versionKey: false,
  timestamps: true,
})

const Student = mongoose.model('students', studentsSchema, 'students')

module.exports = Student
