const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const Event = db.event
const EventType = db.eventType
const EventStatus = db.eventStatus

const ObjectId = mongoose.Types.ObjectId

exports.removeEvent = async (req, res) => {
  await Event.findOneAndDelete(req.body.id)
  return jsonResponse(res, null, null, true, 200)
}

exports.addEvent = async (req, res) => {
  await Event.insertMany(req.body)
  return jsonResponse(res, null, null, true, 201)
}

exports.getEvents = async (req, res) => {
  const events = await getEvents()
  return jsonResponse(res, events)
}

exports.getEventTypes = async (req, res) => {
  const types = await EventType.find({})
  return jsonResponse(res, types)
}

exports.getEventStatuses = async (req, res) => {
  const types = await EventStatus.find({})
  return jsonResponse(res, types)
}

async function getEvents() {
  return Event.aggregate([
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
        from: 'event_statuses',
        localField: 'status',
        foreignField: '_id',
        as: 'status'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'instructor',
        foreignField: '_id',
        as: 'instructor'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'student',
        foreignField: '_id',
        as: 'student'
      }
    },
    {$unwind: '$type'},
    {$unwind: '$status'},
    {$unwind: '$instructor'},
    {$unwind: '$student'},
  ])
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
