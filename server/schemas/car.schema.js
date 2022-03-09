const mongoose = require("mongoose")

const carSchema = new mongoose.Schema({
  model: {
    type: String,
  },
  lpn: {
    type: String,
  },
  color: {
    type: String,
  },
  colorHex: {
    type: String,
  },
  transmission: {
    type: String,
  },
  photo: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const Car = mongoose.model('cars', carSchema, 'cars')

module.exports = Car
