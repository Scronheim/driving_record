const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
  role: {
    type: String,
    ref: 'users'
  },
}, {
  versionKey: false,
})

const Role = mongoose.model('roles', roleSchema, 'roles')

module.exports = Role
