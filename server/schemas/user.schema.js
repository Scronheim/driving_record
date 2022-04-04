const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    school: {
      type: mongoose.Types.ObjectId,
    },
    group: {
      type: mongoose.Types.ObjectId,
    },
    role: {
      type: mongoose.Types.ObjectId,
    },
    course: {
      type: Object,
    },
    phone: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    payments: [
      {
        date: {
          type: Number, // timestamp
        },
        type: {
          type: mongoose.Types.ObjectId,
        },
        sum: {
          type: Number,
        },
        comment: {
          type: String,
        }
      },
    ],
    added: {
      type: Boolean,
    },
    car: {
      type: Object,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = mongoose.model('users', userSchema, 'users')

module.exports = User
