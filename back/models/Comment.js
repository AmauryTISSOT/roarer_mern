const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 280,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  media: [
    {
      type: String,
      url: String,
      type: {
        type: String,
        enum: ["image", "video"],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware pour mettre à jour le nombre de commentaires sur le tweet parent
commentSchema.post("save", async function (doc) {
  await mongoose
    .model("Tweet")
    .findByIdAndUpdate(doc.tweet, { $addToSet: { comments: doc._id } });
});

// Middleware pour supprimer la référence du commentaire dans le tweet parent
commentSchema.post("remove", async function (doc) {
  await mongoose
    .model("Tweet")
    .findByIdAndUpdate(doc.tweet, { $pull: { comments: doc._id } });
});

module.exports = mongoose.model("Comment", commentSchema);
