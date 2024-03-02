const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const userWishListSchema = new mongoose.Schema({
  userId: ObjectId,
  userWishlistItems: [ObjectId],
})

module.exports = mongoose.model('WishList', userWishListSchema);