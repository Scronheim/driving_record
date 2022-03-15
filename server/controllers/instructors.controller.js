const axios = require('axios')
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')
const db = require('../schemas')
const Instructor = db.instructor

const ObjectId = mongoose.Types.ObjectId

exports.updateInstructor = (req, res) => {
  Instructor.findByIdAndUpdate(req.body._id, req.body, {new: true}).then(async () => {
    const user = await getUserById(req.body._id)
    return jsonResponse(res, user[0])
  }).catch((err) => {
    return jsonResponse(res, null, err, 400)
  })
}

exports.getInstructors = async (req, res) => {
  const users = await getUsers()
  return jsonResponse(res, users)
}

exports.insertInstructor = async (req, res) => {
  const user = new Instructor({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    school: req.body.school,
    disabled: req.body.disabled,
    role: ObjectId(req.body.role),
    car: req.body.car,
    password: bcrypt.hashSync(req.body.password, 8)
  })
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
  return Instructor.aggregate([
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
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'school'
      }
    },
    {$unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      }
    },
    {$unwind: {
        path: '$school',
        preserveNullAndEmptyArrays: true,
      }
    },
  ]).project({password: 0}) //exclude password field
}

async function getUsers() {
  return Instructor.aggregate([
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
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'school'
      }
    },
    {$unwind: {
        path: '$role',
        preserveNullAndEmptyArrays: true,
      }
    },
    {$unwind: {
        path: '$school',
        preserveNullAndEmptyArrays: true,
      }
    },
  ]).project({password: 0}) //exclude password field
}
