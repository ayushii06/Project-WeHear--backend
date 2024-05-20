const express=require('express');
const {createProduct,getaProduct,getAllProduct,getWishlist,addToWishlist,rating} = require('../controller/productCtrl')
const {fetchuser}=require('../middlewares/fetchuser.js')

const router = express.Router();


router.post("/add",createProduct);

router.post("/:id",getaProduct)

router.put("/wishlist", fetchuser, addToWishlist);
router.put("/rating", fetchuser, rating);
router.get("/", getAllProduct);

module.exports = router;
