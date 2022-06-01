const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const Event = db.event
const EventType = db.eventType
const EventStatus = db.eventStatus

const ObjectId = mongoose.Types.ObjectId

exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.body._id, req.body, {new: true})
  return jsonResponse(res, event)
}

exports.removeEvent = async (req, res) => {
  await Event.findOneAndDelete(req.body.id)
  return jsonResponse(res, null, null, true, 200)
}

exports.addEvents = async (req, res) => {
  await Event.insertMany(req.body)
  return jsonResponse(res, null, null, true, 201)
}

exports.getEvents = async (req, res) => {
  const events = await Event.find({})
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
