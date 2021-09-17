const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, maxLength: 100, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, maxLength: 500, required: true },
  }, {
  timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);
