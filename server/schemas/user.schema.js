const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  car: {
    type: mongoose.Types.ObjectId,
  },
  school: {
    type: mongoose.Types.ObjectId,
  },
  roles: [
    {
      type: mongoose.Types.ObjectId,
    }
  ],
  phone: {
    type: String,
  },
  disabled: {
    type: Boolean,
  }
}, {
  versionKey: false,
  timestamps: true,
})

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
