const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: false,
    default: false,
  },
  deleverd: {
    type: Boolean,
    required: false,
    default: false,
  },
  payment: {
    type: Object,
    required: false,
  },
  transactionId: {
    type: Object,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", OrderSchema);