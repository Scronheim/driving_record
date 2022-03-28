const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
  transmission: {
    type: String,
  },
  maxCost: {
    type: Number,
  },
  minCost: {
    type: Number,
  },
  driving: {
    type: Object,
  },
  theory: {
    type: Object,
  },
  additionalDriving: {
    type: Number,
  },
  license: {
    type: Boolean,
  },
  description: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Course = mongoose.model('courses', courseSchema, 'courses')

module.exports = Course
