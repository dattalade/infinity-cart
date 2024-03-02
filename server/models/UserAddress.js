const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const diffAddSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
  pincode: Number,
  locality: String,
  landmark: String,
  type: String,
  state: String, 
  district: String,
});

const userAddressSchema = new mongoose.Schema({
  userId: ObjectId,
  userDiffAdd: [diffAddSchema],
})

module.exports = mongoose.model('UserAddress', userAddressSchema);