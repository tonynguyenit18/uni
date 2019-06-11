const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userID: String,
  content: String,
  createAt: Number
});

const CoupleDetailsSchema = new Schema({
  coupleID: {
    type: String,
    required: true
  },
  messages: [MessageSchema]
});

module.exports = CoupleDetails = mongoose.model(
  "coupledetails",
  CoupleDetailsSchema
);
