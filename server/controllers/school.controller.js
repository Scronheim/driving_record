const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const School = db.school
const Group = db.group

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

exports.removeSchool = async (req, res) => {
  const school = await School.findByIdAndDelete(req.body.id)
  return jsonResponse(res, school)
}

exports.updateSchool = async (req, res) => {
  const school = await School.findByIdAndUpdate(req.body._id, req.body, {new: true})
  return jsonResponse(res, school)
}

exports.insertGroup = async (req, res) => {
  const group = new Group(req.body)
  await group.save()
  return jsonResponse(res, group)
}

exports.updateGroup = async (req, res) => {
  const group = await Group.findByIdAndUpdate(req.body._id, req.body, {new: true})
  return jsonResponse(res, group)
}

exports.getGroups = async (req, res) => {
  const groups = await getGroups()
  return jsonResponse(res, groups)
}

async function getSchools() {
  return School.aggregate([
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
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'school'
      }
    },
    {$unwind: '$school'},
  ])
}
