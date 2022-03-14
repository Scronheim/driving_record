const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const School = db.school
const SchoolGroup = db.schoolGroup
const Student = db.student

const ObjectId = mongoose.Types.ObjectId

exports.getSchools = async (req, res) => {
  let result
  if (req.query.id) {
    result = await Student.find({school: req.query.id})
  } else {
    result = await School.find({})
  }
  return jsonResponse(res, result)
}

exports.getSchoolGroups = async (req, res) => {
  const groups = await getSchoolGroupById(req.params.id)
  return jsonResponse(res, groups)
}

async function getSchoolGroupById(id) {
  return SchoolGroup.aggregate([
    {
      $match: {
        school: ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'students',
        localField: 'students',
        foreignField: '_id',
        as: 'students'
      }
    },
    {
      $lookup: {
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'school'
      }
    },
    {$unwind: '$school'}
  ]).project({students: {password: 0}}) //exclude password field
}
