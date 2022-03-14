const mongoose = require('mongoose')
const {jsonResponse} = require('../utils')

const config = require("../config/auth.config")
const db = require("../schemas")
const Student = db.student
const Instructor = db.instructor
const Role = db.role

const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const ObjectId = mongoose.Types.ObjectId

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

exports.signup = (req, res) => {
  const user = new Student({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    school: req.body.school,
    disabled: req.body.disabled,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      return jsonResponse(res, null, err, false, 500)
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            return jsonResponse(res, null, err, false, 500)
          }

          user.roles = roles.map(role => role._id)
          user.save(err => {
            if (err) {
              return jsonResponse(res, null, err, false, 500)
            }
            return jsonResponse(res, user, true, 201)
          })
        }
      );
    } else {
      Role.findOne({ role: 'Ученик' }, (err, role) => {
        if (err) {
          return jsonResponse(res, null, err, false, 500)
        }

        user.roles = [role._id]
        user.save(err => {
          if (err) {
            return jsonResponse(res, null, err, false, 500)
          }
          return jsonResponse(res, user, null, true, 201)
        });
      });
    }
  });
};

exports.signin = async (req, res) => {
  let user = await Student.aggregate([
    {
      $match: {
        email: {$regex: req.body.email, $options: 'i'}
      }
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roles',
        foreignField: '_id',
        as: 'roles'
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
  ]).catch((err) => {
    return jsonResponse(res, null, err)
  })
  user = user[0]
  if (!user) {
    return jsonResponse(res, null, 'Не правильный логин или пароль', false, 401)
  }

  if (user.locked) {
    return jsonResponse(res, null, 'Пользователь заблокирован', false, 401)
  }

  const passwordIsValid = bcrypt.compareSync(
    req.body.password,
    user.password
  )

  if (!passwordIsValid) {
    return jsonResponse(res, null, 'Не правильный логин или пароль', false, 401)
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
  return Student.aggregate([
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
    {$unwind: {
        path: '$car',
        preserveNullAndEmptyArrays: true,
      }
    },
  ]).project({password: 0}) //exclude password field
}
