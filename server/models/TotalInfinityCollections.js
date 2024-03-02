const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema(
{
  imageName: String,
  image: String,
  apparel: String,
  category: String,
  designType: String,
  displayName: String,
  originalPrice: Number,
  discountPrice: Number,
  sizeData:[ {size: Number, quantity: Number} ],
})

module.exports = mongoose.model('TotalInfinityCollections', collectionSchema);