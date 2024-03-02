const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob : Date,
  mobile: Number,
  state: String,
  district: String,
  password: String,
  whenRegistered: Date,
  isVerified: {type: Boolean, default: false, required: true}
})

module.exports = mongoose.model('User', userSchema);