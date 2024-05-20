const ProductModel = require('../models/ProductModel.js');
const User = require('../models/userModel.js')
const {body,validationResult}=require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { getWishlist } = require('./userCtrl.js');
require('dotenv').config();

//create a user

const createProduct = ([ //express validation 
body('product_name','invalid Name').isLength({min:3}),
body('desc','invalid description').isLength({min:5}),

],async (req, res) => {
   let success=false;
   //if there is error then show status 400 with the error
   const error=validationResult(req);
   if(!error.isEmpty()){
      return res.status(400).json({success,error:error.array()});
   }

   try{
   product = await ProductModel.create({
      product_name:req.body.product_name,
      desc:req.body.desc,
     price:req.body.price,
     category:req.body.category,
     images:req.body.images,
     tags:req.body.tags,
   });
   // user.toObject();
   const data={
      product:{
         id:product.id
      }
   }
   success=true;
   const authtoken=jwt.sign(data,process.env.JWT_SECRET);
   console.log(authtoken);
   res.json({success,"authtoken":authtoken});
   } catch(error) {    
      console.error(error.message);
      res.status(500).json({success,error:'Internal Server Error'});

   }
 });

//Get product -------------------------

const getaProduct = async (req,res) =>{
   try {
      const products = await ProductModel.find()
      res.send(products)
   } catch (error) {
       console.error(error.message);
         res.status(500).send('Internal Server Error');
   }
   
}

const getAllProduct = asyncHandler(async (req, res) => {
   try {
     // Filtering
     const queryObj = { ...req.query };
     const excludeFields = ["page", "sort", "limit", "fields"];
     excludeFields.forEach((el) => delete queryObj[el]);
     let queryStr = JSON.stringify(queryObj);
    
     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
     console.log(JSON.parse(queryStr))
     let query = ProductModel.find(JSON.parse(queryStr));
 
     // Sorting
 
     if (req.query.sort) {
       const sortBy = req.query.sort.split(",").join(" ");
       query = query.sort(sortBy);
     } else {
       query = query.sort("-createdAt");
     }
 
     // limiting the fields
 
     if (req.query.fields) {
       const fields = req.query.fields.split(",").join(" ");
       query = query.select(fields);
     } else {
       query = query.select("-__v");
     }
 
     // pagination
 
     const page = req.query.page;
     const limit = req.query.limit;
     const skip = (page - 1) * limit;
     query = query.skip(skip).limit(limit);
     if (req.query.page) {
       const productCount = await ProductModel.countDocuments();
       if (skip >= productCount) throw new Error("This Page does not exists");
     }
     const product = await query;
     res.json(product);
   } catch (error) {
     throw new Error(error);
   }
 });


const addToWishlist = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { prodId } = req.body;
   try {
     const user = await User.findById(_id);
     const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
     if (alreadyadded) {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $pull: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     } else {
       let user = await User.findByIdAndUpdate(
         _id,
         {
           $push: { wishlist: prodId },
         },
         {
           new: true,
         }
       );
       res.json(user);
     }
   } catch (error) {
     throw new Error(error);
   }
 });
 
 const rating = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { star, prodId, comment } = req.body;
   try {
     const product = await ProductModel.findById(prodId);
     let alreadyRated = product.ratings.find(
       (userId) => userId.postedby.toString() === _id.toString()
     );
     if (alreadyRated) {
       const updateRating = await ProductModel.updateOne(
         {
           ratings: { $elemMatch: alreadyRated },
         },
         {
           $set: { "ratings.$.star": star, "ratings.$.comment": comment },
         },
         {
           new: true,
         }
       );
     } else {
       const rateProduct = await ProductModel.findByIdAndUpdate(
         prodId,
         {
           $push: {
             ratings: {
               star: star,
               comment: comment,
               postedby: _id,
             },
           },
         },
         {
           new: true,
         }
       );
     }
     const getallratings = await ProductModel.findById(prodId);
     let totalRating = getallratings.ratings.length;
     let ratingsum = getallratings.ratings
       .map((item) => item.star)
       .reduce((prev, curr) => prev + curr, 0);
     let actualRating = Math.round(ratingsum / totalRating);
     let finalproduct = await ProductModel.findByIdAndUpdate(
       prodId,
       {
         totalrating: actualRating,
       },
       { new: true }
     );
     res.json(finalproduct);
   } catch (error) {
     throw new Error(error);
   }
 });


module.exports={createProduct,getaProduct,getAllProduct,getWishlist,addToWishlist,rating}