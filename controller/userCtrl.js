const User =require('../models/userModel.js')
const {body,validationResult}=require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const asyncHandler = require('express-async-handler')
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const {generateRefreshToken} = require("../config/refreshtoken.js")
const crypto = require("crypto");

exports.signUp = async(req,res)=>{
  let success=false;
  try{
      let user = await User.findOne({email:req.body.email});
      if(user){
          return res.status(400).json({success,error:"Email ALready exists"})
      }

      const secPass = await bcrypt.hash(req.body.password,10);
      user=await User.create({
          name:req.body.name,
          email:req.body.email,
          age:req.body.age,
          gender:req.body.gender,
          password:secPass,

      })

      const data={
          user:{
              id:user.id
          }
      }

      success=true;
     
      res.json({success,"message":"user created successfully"});
  }catch(error){
      console.log(error)
      res.status(404).send(success,'Internal Server Error')
  }

}


exports.login = async (req,res)=>{
  try{
      const {email,password} = req.body;
      if(!email||!password){
          return res.status(500).json({
              success:false,
              message:'Fill details carefully',
          });
      }
      var user = await User.findOne({email:email});
      if(!user){
          return res.status(404).json({
              success:false,
              message:'User Not Found',
          });
      }
      const payload = {
          id:user._id,
          email:user.email,
      }
      if(await bcrypt.compare(password,user.password)){
          const token = jwt.sign(payload,process.env.JWT_SECRET,{
              expiresIn:"2h",
          });
          user = user.toObject();
          user.token = token;
          user.password = undefined;
          const options = {
              expiresIn: new Date(Date.now() + 3*24*60*60*1000),
              httpOnly:true,
          }
          res.cookie("token",token,options).status(200).json({
              success:true,
              token,
              user,
              message:'Logged in Successfully',
          });
      }
      else{
          return res.status(403).json({
              success:false,
              message:'Please login with correct credentials',
          })
      }
  }
  catch(error){
      return res.status(500).json({
          success:false,
          message:error.message,
      })
  }
}


// Create a User ----------------------------------------------

// const createUser = asyncHandler(async (req, res) => {
   
//    const email = req.body.email;
//    const findUser = await User.findOne({ email: email });
 
//    if (!findUser) {
//      const salt = await bcrypt.genSalt(10);
//      const secPass=await bcrypt.hash(req.body.password,salt);
//      const newUser = await User.create({
//       name:req.body.name,
//       email:req.body.email,
//       mobile:req.body.mobile,
//       password:secPass,
//    });
//      res.json(newUser);
//    } else {
//      throw new Error("User Already Exists");
//    }
//  });

// // Login/Verify a User ----------------------------------------------

// //  const loginUserCtrl = asyncHandler(async (req, res) => {
// //    const { email, password } = req.body;
// //    // check if user exists or not
// //    const findUser = await User.findOne({ email });
// //    if (findUser && (await bcrypt.compare(password,findUser.password))) {
// //      const refreshToken = await generateRefreshToken(findUser?._id);
// //      const updateuser = await User.findByIdAndUpdate(
// //        findUser.id,
// //        {
// //          refreshToken: refreshToken,
// //        },
// //        { new: true }
// //      );
// //      res.cookie("refreshToken", refreshToken, {
// //        httpOnly: true,
// //        maxAge: 72 * 60 * 60 * 1000,
// //      });
// //      res.json({
// //        _id: findUser?._id,
// //        name: findUser?.name,
// //        email: findUser?.email,
// //        mobile: findUser?.mobile,
// //        token: generateToken(findUser?._id),
// //      });
// //    } else {
// //      throw new Error("Invalid Credentials");
// //    }
// //  });
 


// const loginDetail =  (async (req, res) => {
//    console.log("its's here")
//    const {id} = req.params;
//    console.log(id)
 
//    try {
//      const getaUser = await User.findById(id);
//      res.json({
//        getaUser,
//      });
//    } catch (error) {
//      throw new Error(error);
//    }
//  });

//  //logout
//  const logout = asyncHandler(async (req, res) => {
//    const cookie = req.cookies;
//    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//    const refreshToken = cookie.refreshToken;
//    const user = await User.findOne({ refreshToken });
//    if (!user) {
//      res.clearCookie("refreshToken", {
//        httpOnly: true,
//        secure: true,
//      });
//      return res.sendStatus(204); // forbidden
//    }
//    await User.findOneAndUpdate(refreshToken, {
//      refreshToken: "",
//    });
//    res.clearCookie("refreshToken", {
//      httpOnly: true,
//      secure: true,
//    });
//    res.sendStatus(204); // forbidden
//  });

//  //get a user
//  const getaUser = asyncHandler(async (req, res) => {
//    const { id } = req.params;
//    validateMongoDbId(id);
 
//    try {
//      const getaUser = await User.findById(id);
//      res.json({
//        getaUser,
//      });
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 
//  // Delete a single user
 
//  const deleteaUser = asyncHandler(async (req, res) => {
//    const { id } = req.params;
//    validateMongoDbId(id);
 
//    try {
//      const deleteaUser = await User.findByIdAndDelete(id);
//      res.json({
//        deleteaUser,
//      });
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 

//  const handleRefreshToken = asyncHandler(async (req, res) => {
//    const cookie = req.cookies;
//    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
//    const refreshToken = cookie.refreshToken;
//    const user = await User.findOne({ refreshToken });
//    if (!user) throw new Error(" No Refresh token present in db or not matched");
//    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
//      if (err || user.id !== decoded.id) {
//        throw new Error("There is something wrong with refresh token");
//      }
//      const accessToken = generateToken(user?._id);
//      res.json({ accessToken });
//    });
//  });

//  const saveAddress = asyncHandler(async (req, res, next) => {
//    const { _id } = req.user;
//    validateMongoDbId(_id);
 
//    try {
//      const updatedUser = await User.findByIdAndUpdate(
//        _id,
//        {
//          address: req?.body?.address,
//        },
//        {
//          new: true,
//        }
//      );
//      res.json(updatedUser);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });

//  const updatePassword = asyncHandler(async (req, res) => {
//    const { _id } = req.user;
//    const { password } = req.body;
//    validateMongoDbId(_id);
//    const user = await User.findById(_id);
//    if (password) {
//      user.password = password;
//      const updatedPassword = await user.save();
//      res.json(updatedPassword);
//    } else {
//      res.json(user);
//    }
//  });
 
//  const forgotPasswordToken = asyncHandler(async (req, res) => {
//    const { email } = req.body;
//    const user = await User.findOne({ email });
//    if (!user) throw new Error("User not found with this email");
//    try {
//      const token = await user.createPasswordResetToken();
//      await user.save();
//      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
//      const data = {
//        to: email,
//        text: "Hey User",
//        subject: "Forgot Password Link",
//        htm: resetURL,
//      };
//      sendEmail(data);
//      res.json(token);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 
//  const resetPassword = asyncHandler(async (req, res) => {
//    const { password } = req.body;
//    const { token } = req.params;
//    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
//    const user = await User.findOne({
//      passwordResetToken: hashedToken,
//      passwordResetExpires: { $gt: Date.now() },
//    });
//    if (!user) throw new Error(" Token Expired, Please try again later");
//    user.password = password;
//    user.passwordResetToken = undefined;
//    user.passwordResetExpires = undefined;
//    await user.save();
//    res.json(user);
//  });
 
//  const getWishlist = asyncHandler(async (req, res) => {
//    const { _id } = req.user;
//    try {
//      const findUser = await User.findById(_id).populate("wishlist");
//      res.json(findUser);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 
//  const userCart = asyncHandler(async (req, res) => {
//    const { cart } = req.body;
//    const { _id } = req.user;
//    validateMongoDbId(_id);
//    try {
//      let products = [];
//      const user = await User.findById(_id);
//      // check if user already have product in cart
//      const alreadyExistCart = await Cart.findOne({ orderby: user._id });
//      if (alreadyExistCart) {
//        alreadyExistCart.remove();
//      }
//      for (let i = 0; i < cart.length; i++) {
//        let object = {};
//        object.product = cart[i]._id;
//        object.count = cart[i].count;
//        object.color = cart[i].color;
//        let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//        object.price = getPrice.price;
//        products.push(object);
//      }
//      let cartTotal = 0;
//      for (let i = 0; i < products.length; i++) {
//        cartTotal = cartTotal + products[i].price * products[i].count;
//      }
//      let newCart = await new Cart({
//        products,
//        cartTotal,
//        orderby: user?._id,
//      }).save();
//      res.json(newCart);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 
//  const getUserCart = asyncHandler(async (req, res) => {
//    const { _id } = req.user;
//    validateMongoDbId(_id);
//    try {
//      const cart = await Cart.findOne({ orderby: _id }).populate(
//        "products.product"
//      );
//      res.json(cart);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });
 
//  const emptyCart = asyncHandler(async (req, res) => {
//    const { _id } = req.user;
//    validateMongoDbId(_id);
//    try {
//      const user = await User.findOne({ _id });
//      const cart = await Cart.findOneAndRemove({ orderby: user._id });
//      res.json(cart);
//    } catch (error) {
//      throw new Error(error);
//    }
//  });

// module.exports={createUser,loginUserCtrl,loginDetail,saveAddress,handleRefreshToken,logout,getaUser,deleteaUser,updatePassword,forgotPasswordToken,resetPassword,getWishlist,userCart,getUserCart,emptyCart}