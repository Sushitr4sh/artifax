const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promptSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  textChat: String,
  responseUrl: String,
  responseFileName: String,
});

module.exports = mongoose.model("Prompt", promptSchema);
