const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creat UserSchema
const UserSchema = new Schema({
  nickname: {
    type: String
  },
  partnerNickname: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String
  },
  coupleID: {
    type: String
  },
  firstDate: {
    type: String
  }
});

module.exports = User = mongoose.model("user", UserSchema);
