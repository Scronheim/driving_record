const db = require("../schemas")
const Student = db.student

checkDuplicateEmail = (req, res, next) => {
  // Email
  Student.findOne({
    email: req.body.email
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      return
    }
    if (user) {
      res.status(400).send({ message: "Такой email уже используется!" })
      return
    }
    next()
  })
}

const verifySignUp = {
  checkDuplicateEmail,
}

module.exports = verifySignUp
