const axios = require('axios')
const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const User = db.user
const Role = db.role

const ObjectId = mongoose.Types.ObjectId

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.body._id, req.body, {new: true}).then(async () => {
    const user = await getUserById(req.body._id)
    return jsonResponse(res, user[0])
  }).catch((err) => {
    return jsonResponse(res, null, err, 400)
  })
}

exports.aboutMe = async (req, res) => {
  const user = await getUserById(req.userId)
  return jsonResponse(res, user[0])
}

exports.getUsers = async (req, res) => {
  const users = await getUsers()
  return jsonResponse(res, users)
}

exports.getRoles = async (req, res) => {
  const roles = await Role.find({})
  return jsonResponse(res, roles)
}

exports.insertUser = async (req, res) => {
  const user = new User(req.body)
  await user.save()
  return jsonResponse(res, user)
}

exports.verifyRecaptchaToken = async (req, res) => {
  const payload = {
    secret: '6Lcc1tIdAAAAACQJ87zmF6UbCjH60k3xxl6NIm-X',
    response: req.body.token
  }
  const {data} = await axios.post('https://www.google.com/recaptcha/api/siteverify', new URLSearchParams(Object.entries(payload)).toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })
  return jsonResponse(res, data)
}

async function getUserById(id) {
  return User.aggregate([
    {
      $match: {
        _id: ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car'
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
    {$unwind: '$role'},
    // {$unwind: '$school'},
  ]).project({password: 0}) //exclude password field
}

async function getUsers() {
  return User.aggregate([
    {
      $lookup: {
        from: 'roles',
        localField: 'role',
        foreignField: '_id',
        as: 'role'
      }
    },
    {
      $lookup: {
        from: 'cars',
        localField: 'car',
        foreignField: '_id',
        as: 'car'
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
    {$unwind: '$car'},
    {$unwind: '$school'},
    {$unwind: '$role'},
  ]).project({password: 0}) //exclude password field
}
