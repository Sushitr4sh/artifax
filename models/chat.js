const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Prompt = require("./prompt");

const chatSchema = new Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  prompts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Prompt",
    },
  ],
});

chatSchema.post("findOneAndDelete", async function (doc) {
  await Prompt.deleteMany({
    _id: {
      $in: doc.prompts,
    },
  });
});

module.exports = mongoose.model("Chat", chatSchema);
