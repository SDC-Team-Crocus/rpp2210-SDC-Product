// Product schema
const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  feature: String,
  value: String
});

const skuSchema = new mongoose.Schema({
  quantity: Number,
  size: String
});

const photoSchema = new mongoose.Schema({
  thumbnail_url: String,
  url: String
});

const styleSchema = new mongoose.Schema({
  style_id: Number,
  name: String,
  original_price: String,
  sale_price: String,
  default: Boolean,
  photos: [photoSchema],
  skus: {
    type: Map,
    of: skuSchema
  }
});

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [featureSchema],
  styles: [styleSchema]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;