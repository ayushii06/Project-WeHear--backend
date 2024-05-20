const { MongoClient, ServerApiVersion } = require("mongodb");
const { default: mongoose } = require("mongoose");
require('dotenv').config();

const uri = process.env.CONNECTION_STRING || "";

const db=async()=>{
   await mongoose.connect(uri,
    console.log("Database connected successfully"));
 
}

module.exports= db;