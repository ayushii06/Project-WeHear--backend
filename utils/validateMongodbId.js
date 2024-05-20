const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This id is not valid or not Found");
  else{
    console.log("succesfully verified")
  }
};
module.exports = validateMongoDbId;