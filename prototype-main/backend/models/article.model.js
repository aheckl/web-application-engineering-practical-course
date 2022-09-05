const mongoose = require("mongoose");

const Article = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
  text: { type: String, required: true },
  previewText: { type: String, required: true },
  image: { type: String, required: false },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      author: { type: String, require: true },
      author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: { type: String, require: true },
      date: { type: Date, require: true },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    },
  ],
});

const model = mongoose.model("Article", Article);

module.exports = model;
