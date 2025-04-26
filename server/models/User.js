const mongoose = require("mongoose");

// create User schema
// require: unique email, password
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String }, // for Google login users
    name: { type: String }
  });
  
// make schema avaliable to mongo
module.exports = mongoose.model('User', UserSchema);