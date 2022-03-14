const mongoose = require("mongoose")

const paymentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
}, {
  versionKey: false,
  timestamps: true,
})

const PaymentType = mongoose.model('payment_types', paymentTypeSchema, 'payment_types')

module.exports = PaymentType
