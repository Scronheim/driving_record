const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const Event = db.event

const ObjectId = mongoose.Types.ObjectId

exports.getUserEvents = async (req, res) => {
  let events
  if (req.query.id) {
    events = await getUserEvents(req.query.id)
  } else {
    events = await Event.find({})
  }
  return jsonResponse(res, events)
}

exports.getEventTypes = async (req, res) => {
  const types = await Event.find({})
  return jsonResponse(res, types)
}


async function getUserEvents(userId) {
  return Event.aggregate([
    {
      $match: {
        $or: [{instructor: ObjectId(userId)}, {student: ObjectId(userId)}]
      }
    },
    {
      $lookup: {
        from: 'event_types',
        localField: 'type',
        foreignField: '_id',
        as: 'type'
      }
    },
    {
      $lookup: {
        from: 'instructors',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor'
      }
    },
    {
      $lookup: {
        from: 'students',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    {$unwind: '$type'},
    {$unwind: '$instructor'},
    {$unwind: '$student'},
  ])
}
