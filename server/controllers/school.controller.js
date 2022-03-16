const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const School = db.school
const SchoolGroup = db.schoolGroup

const ObjectId = mongoose.Types.ObjectId

exports.getSchools = async (req, res) => {
  // const schools = await School.find({})
  const schools = await getSchools()
  return jsonResponse(res, schools)
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

async function getSchools() {
  return School.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'groups.students',
        foreignField: '_id',
        as: 'groups.students'
      }
    },
  ])
}
