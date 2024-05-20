const express=require('express');
// const {createUser,loginUserCtrl,loginDetail,saveAddress,handleRefreshToken,logout,getaUser,deleteaUser,updatePassword,forgotPasswordToken,resetPassword,getWishlist,userCart,getUserCart,emptyCart} = require('../controller/userCtrl')
const {fetchuser}=require('../middlewares/fetchuser.js')
const User =require('../models/userModel.js')
const {signUp,login}=require('../controller/userCtrl.js')

const router = express.Router();

router.post('/signup',signUp);
router.post('/login',login);

// router.post("/register", createUser);
// router.post("/forgot-password-token", forgotPasswordToken);
// router.put("/reset-password/:token", resetPassword);
// router.put("/password", fetchuser, updatePassword);
// router.post("/login", loginUserCtrl);
// router.post("/:id",fetchuser, loginDetail);
// router.post("/cart", fetchuser, userCart);
// router.get("/refresh", handleRefreshToken);
// router.get("/logout", logout);
// router.get("/wishlist", fetchuser, getWishlist);
// router.get("/cart", fetchuser, getUserCart);

// router.delete("/empty-cart", fetchuser, emptyCart);
// router.delete("/:id", deleteaUser);
// router.put("/save-address", fetchuser, saveAddress);


module.exports=router