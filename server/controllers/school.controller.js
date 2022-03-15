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

exports.insertSchool = async (req, res) => {
  const school = new School({
    address: req.body.address
  })
  await school.save()
  return jsonResponse(res, school)
}

exports.updateSchool = async (req, res) => {
  const school = await School.findByIdAndUpdate(req.body._id, req.body, {new: true})
  return jsonResponse(res, school)
}

exports.getSchoolGroups = async (req, res) => {
  const groups = await getSchoolGroups()
  return jsonResponse(res, groups)
}

async function getSchoolGroups() {
  return SchoolGroup.aggregate([
    {
      $lookup: {
        from: 'students',
        localField: 'students',
        foreignField: '_id',
        as: 'students'
      }
    },
  ]).project({students: {password: 0}}) //exclude password field
}
