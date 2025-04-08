const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    maxlength: 500,
  },
  collections: [
    {
      type: String,
      default: "Default",
    },
  ],
});

// Index composé pour éviter les doublons
bookmarkSchema.index({ user: 1, tweet: 1 }, { unique: true });

// Méthode statique pour vérifier si un tweet est dans les signets
bookmarkSchema.statics.isBookmarked = async function (userId, tweetId) {
  const bookmark = await this.findOne({ user: userId, tweet: tweetId });
  return !!bookmark;
};

module.exports = mongoose.model("Bookmark", bookmarkSchema);
