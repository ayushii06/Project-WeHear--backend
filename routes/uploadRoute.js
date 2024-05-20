const express = require("express");
const { uploadImages } = require("../controller/uploadCtrl");
// const { fetchuser } = require("../middlewares/fetchuser");
// const { uploadPhoto, productImgResize } = require("../middlewares/uploadImage");
const router = express.Router();

router.post('/localfileupload',uploadImages);

module.exports = router;