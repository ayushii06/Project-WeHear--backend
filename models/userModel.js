const mongoose=require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    age:{
      type:Number,
      required:true,
    },
    gender:{
      type:String,
      required:true,
    },
    password:{
        type:String,
        required:true,
    },
      passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
   
  });
 


//Export the model
module.exports= mongoose.model('User', userSchema);