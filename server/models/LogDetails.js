const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: String,
  logs: [Date],
})

module.exports = mongoose.model('LogDetails', userSchema);