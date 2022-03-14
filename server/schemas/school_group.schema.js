const mongoose = require("mongoose")

const schoolGroupSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  school: {
    type: mongoose.Types.ObjectId,
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
    }
  ],
  endedAt: {
    type: Date,
  }
}, {
  versionKey: false,
  timestamps: true,
})

const SchoolGroup = mongoose.model('school_groups', schoolGroupSchema, 'school_groups')

module.exports = SchoolGroup
