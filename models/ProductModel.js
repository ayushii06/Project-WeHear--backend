const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,

  },
  selling_price: {
    type: Number,
    required: true,

  },
  market_price: {
    type: Number,
    required: true,

  },
  category: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    required:true,
  },
  imgsrc:{
    type:String,
    required:true,
  },
  imghoversrc:{
    type:String,
    required:true
  },
  sold: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: String,
      url: String,
    },
  ],
  tags: [],
  ratings: [
    {
      star: Number,
      comment: String,
      postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  totalrating: {
    type: String,
    default: 0,
  },
},
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);