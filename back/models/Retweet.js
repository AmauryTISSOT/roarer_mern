const mongoose = require("mongoose");

const retweetSchema = new mongoose.Schema({
  // Champs requis
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalTweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tweet",
    required: true,
  },
  type: {
    type: String,
    enum: ["retweet", "quote"],
    required: true,
  },
  quoteContent: {
    type: String,
    maxlength: 280,
    required: function () {
      return this.type === "quote";
    },
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  // Champs optionnels (comme dans Tweet.js)
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  metrics: {
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
});

// Index composé pour éviter les retweets multiples
retweetSchema.index({ user: 1, originalTweet: 1 }, { unique: true });

// Index pour la recherche de texte dans les quotes
retweetSchema.index({ quoteContent: "text" });

// Middleware pour mettre à jour les métriques
retweetSchema.pre("save", function (next) {
  if (this.isModified("likes")) {
    this.metrics.likeCount = this.likes.length;
  }
  next();
});

// Middleware pour mettre à jour le tweet original
retweetSchema.post("save", async function (doc) {
  await mongoose.model("Tweet").findByIdAndUpdate(doc.originalTweet, {
    $addToSet: { retweets: doc._id },
    $inc: { "metrics.retweetCount": 1 },
  });
});

retweetSchema.post("remove", async function (doc) {
  await mongoose.model("Tweet").findByIdAndUpdate(doc.originalTweet, {
    $pull: { retweets: doc._id },
    $inc: { "metrics.retweetCount": -1 },
  });
});

// Méthodes d'instance (comme dans Tweet.js)
retweetSchema.methods.like = async function (userId) {
  if (!this.likes.some((like) => like.user.toString() === userId.toString())) {
    this.likes.push({ user: userId });
    await this.save();
  }
};

retweetSchema.methods.unlike = async function (userId) {
  this.likes = this.likes.filter(
    (like) => like.user.toString() !== userId.toString()
  );
  await this.save();
};

module.exports = mongoose.model("Retweet", retweetSchema);