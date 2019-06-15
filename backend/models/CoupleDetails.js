const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  userID: String,
  content: String,
  createAt: Number
});

const MemorySchema = new Schema({
  memoryName: String,
  imageUrls: Array
});

const EventSchema = new Schema({
  title: String,
  dateAndTime: String
});

const CoupleDetailsSchema = new Schema({
  coupleID: {
    type: String,
    required: true
  },
  messages: { type: [MessageSchema], default: [] },
  memories: { type: [MemorySchema], default: [] },
  nextEvents: { type: [EventSchema], default: [] }
});

module.exports = CoupleDetails = mongoose.model(
  "coupledetails",
  CoupleDetailsSchema
);
