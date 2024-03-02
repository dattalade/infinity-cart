const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  itemId: ObjectId,
  quantity: Number,
  size: Number
});

const userCartSchema = new mongoose.Schema({
  userId: ObjectId,
  usercartItems: [itemSchema],
})

module.exports = mongoose.model('UserCart', userCartSchema);