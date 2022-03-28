const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const Course = db.course

const ObjectId = mongoose.Types.ObjectId

exports.getCourses = async (req, res) => {
  const courses = await Course.find({})
  // const schools = await getSchools()
  return jsonResponse(res, courses)
}

exports.insertSchool = async (req, res) => {
  const school = new Course({
    address: req.body.address
  })
  await school.save()
  return jsonResponse(res, school)
}

exports.updateSchool = async (req, res) => {
  const school = await Course.findByIdAndUpdate(req.body._id, req.body, {new: true})
  return jsonResponse(res, school)
}

exports.getGroups = async (req, res) => {
  const groups = await getGroups()
  return jsonResponse(res, groups)
}

async function getSchools() {
  return Course.aggregate([
    {
      $lookup: {
        from: 'groups',
        localField: 'groups',
        foreignField: '_id',
        as: 'groups'
      }
    },
  ])
}

async function getGroups() {
  return Group.aggregate([
    {
      $lookup: {
        from: 'users',
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
    {$unwind: '$school'},
  ])
}
