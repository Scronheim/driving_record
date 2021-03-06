const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')

const config = require("../config/auth.config")
const db = require("../schemas")
const User = db.user
const Role = db.role

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ObjectId = mongoose.Types.ObjectId

exports.changePassword = async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {password: bcrypt.hashSync(req.body.password, 8)}, {new: false})
  return jsonResponse(res, null)
}

exports.aboutMe = async (req, res) => {
  const user = await getStudentById(req.userId)
  if (user[0]) {
    return jsonResponse(res, user[0])
  }
  const instructor = await getInstructorById(req.userId)
  return jsonResponse(res, instructor[0])
}

exports.getRoles = async (req, res) => {
  const roles = await Role.find({})
  return jsonResponse(res, roles)
}

exports.signUp = (req, res) => {
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    school: req.body.school,
    disabled: false,
    password: bcrypt.hashSync(req.body.password, 8),
    added: false,
    group: null,
    payments: [],
    role: ObjectId('622062c9056fad1a42ab2cf1'),
    car: null,
    drivingCost: 800,
    course: {},
  });

  user.save()
  return jsonResponse(res, user, true, 201)
};

exports.signIn = async (req, res) => {
  let user = await User.aggregate([
    {
      $match: {
        email: {$regex: req.body.email, $options: 'i'}
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
    {
      $lookup: {
        from: 'groups',
        localField: 'group',
        foreignField: '_id',
        as: 'group'
      }
    },
    {$unwind: {
        path: '$group',
        preserveNullAndEmptyArrays: true,
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
  ]).catch((err) => {
    return jsonResponse(res, null, err)
  })
  user = user[0]
  if (!user) {
    return jsonResponse(res, null, '???? ???????????????????? ?????????? ?????? ????????????', false, 401)
  }
  if (!user.added) {
    return jsonResponse(res, null, '???????????????????????? ?????? ???? ??????????????????????. ?????????????????? ?????????????????? ??????????????????????????????', false, 401)
  }
  if (user.locked) {
    return jsonResponse(res, null, '???????????????????????? ????????????????????????', false, 401)
  }

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  )

  if (!passwordIsValid) {
    return jsonResponse(res, null, '???? ???????????????????? ?????????? ?????? ????????????', false, 401)
  }

  const token = jwt.sign({ id: user._id.toString() }, config.secret, {
    expiresIn: 628000000 // 1 month
  })

  const response = {
    user: user,
    token: token
  }
  return jsonResponse(res, response)
}

async function getStudentById(id) {
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
        from: 'schools',
        localField: 'school',
        foreignField: '_id',
        as: 'school'
      }
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'group',
        foreignField: '_id',
        as: 'group'
      }
    },
    {$unwind: {
        path: '$group',
        preserveNullAndEmptyArrays: true,
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

async function getInstructorById(id) {
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
