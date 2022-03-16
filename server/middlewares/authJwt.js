const jwt = require("jsonwebtoken")
const config = require("../config/auth.config.js")
const db = require("../schemas")
const {jsonResponse} = require("../utils")
const User = db.user
const Role = db.role

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"]

  if (!token) {
    return res.status(403).send({ message: "No token provided!" })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" })
    }
    req.userId = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }
    Role.find(
      {
        _id: user.role
      },
      (err, roles) => {
        if (err) {
          return jsonResponse(res, null, err, false, 500)
        }
        const role = roles.find((r) => {
          return r.role === 'Администратор'
        })
        if (role) {
          next()
          return
        } else {
          return jsonResponse(res, null, 'Недостаточно прав', false, 403)
        }
      }
    )
  })
}

isInstructor = (req, res, next) => {
  Instructor.findById(req.userId).exec((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }
    Role.find(
      {
        _id: user.role
      },
      (err, roles) => {
        if (err) {
          return jsonResponse(res, null, err, false, 500)
        }
        const role = roles.find((r) => {
          return r.role === 'Инструктор'
        })
        if (role) {
          next()
          return
        } else {
          return jsonResponse(res, null, 'Недостаточно прав', false, 403)
        }
      }
    )
  })
}

isStudent = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      jsonResponse(res, null, err, false, 500)
    }
    Role.find(
      {
        _id: user.role
      },
      (err, roles) => {
        if (err) {
          return jsonResponse(res, null, err, false, 500)
        }

        const role = roles.find((r) => {
          return r.role === 'Ученик'
        })
        if (role) {
          next()
          return
        } else {
          return jsonResponse(res, null, 'Недостаточно прав', false, 403)
        }
      }
    )
  })
}

const authJwt = {
  verifyToken,
  isAdmin,
  isInstructor,
  isStudent,
}
module.exports = authJwt
