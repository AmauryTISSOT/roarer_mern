const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  // Champs requis par l'image
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 280,
  },
  id_media_pictures: [
    {
      type: String, // URLs des images
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  // Champs additionnels pour les futures fonctionnalités (options)
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
  retweets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retweet",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
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
    retweetCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
});

// Index pour la recherche
tweetSchema.index({ text: "text" });

// Middleware pour mettre à jour les métriques
tweetSchema.pre("save", function (next) {
  if (this.isModified("likes")) {
    this.metrics.likeCount = this.likes.length;
  }
  if (this.isModified("retweets")) {
    this.metrics.retweetCount = this.retweets.length;
  }
  if (this.isModified("comments")) {
    this.metrics.commentCount = this.comments.length;
  }
  next();
});

// Méthodes d'instance
tweetSchema.methods.like = async function (userId) {
  if (!this.likes.some((like) => like.user.toString() === userId.toString())) {
    this.likes.push({ user: userId });
    await this.save();
  }
};

tweetSchema.methods.unlike = async function (userId) {
  this.likes = this.likes.filter(
    (like) => like.user.toString() !== userId.toString()
  );
  await this.save();
};

module.exports = mongoose.model("Tweet", tweetSchema);
