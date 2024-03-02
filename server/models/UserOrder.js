const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  itemDetails:
    [{
      itemId: ObjectId,
      quantity: Number,
      size: Number,
    }],
  cost: {
    totalCost: Number,
    payCost: Number,
    shippingCost: Number
  },
  paymentType: String,
  paymentInfo: {
    order_id: String,
    payment_id: String,
    signature: String
  },
  addressId: ObjectId,
});

const userOrderSchema = new mongoose.Schema({
  userId: ObjectId,
  userOrderItems: [itemSchema],
})

module.exports = mongoose.model('UserOrder', userOrderSchema);