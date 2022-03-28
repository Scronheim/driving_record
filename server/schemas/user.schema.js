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
      type: mongoose.Types.ObjectId,
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
          type: Date,
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
    drivingCost: {
      type: Number,
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
