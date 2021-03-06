const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  education: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: false,
    default:false
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);