const mongoose = require("mongoose")

const schoolGroupSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
    }
  ],
  start: {
    type: Date,
  },
  end: {
    type: Date,
  }
}, {
  versionKey: false,
  timestamps: true,
})

const SchoolGroup = mongoose.model('school_groups', schoolGroupSchema, 'school_groups')

module.exports = SchoolGroup
