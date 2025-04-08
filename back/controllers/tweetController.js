const Tweet = require("../models/Tweet");
const Comment = require("../models/Comment");
const Retweet = require("../models/Retweet");
const Bookmark = require("../models/Bookmark");
const User = require("../models/User")
const notificationController = require('./notificationController');

// Gestionnaire d'erreurs asynchrone
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Créer un tweet
exports.createTweet = asyncHandler(async (req, res) => {
  const { text, id_media_pictures } = req.body;
  
  const tweet = new Tweet({
    id_user: req.user._id, // Vient du middleware auth
    text,
    id_media_pictures: id_media_pictures || [],
  });

  await tweet.save();

  console.log()
  const author = await User.findById(req.user._id).populate('followers');
  if (author && author.followers && author.followers.length > 0) {
    // Pour chaque follower, créer et envoyer une notification
    author.followers.forEach(async (follower) => {
      await notificationController.createNotification({
        user: follower._id, // Destinataire de la notification
        type: 'tweet',
        content: `${author.name} a posté un nouveau tweet.`,
        tweet: tweet._id,
      });
    });
  }

  res.status(201).json({
    success: true,
    data: tweet,
  });
});

// Récupérer tous les tweets
exports.getFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const tweets = await Tweet.find()
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("id_user", "username avatar") // Supposant que ces champs existent dans User
    .lean();

  res.json({
    success: true,
    count: tweets.length,
    data: tweets,
  });
});

// Récupérer un tweet spécifique
exports.getTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id)
    .populate("id_user", "username avatar")
    .populate({
      path: "comments",
      populate: { path: "author", select: "username avatar" },
    });

  if (!tweet) {
    return res.status(404).json({
      success: false,
      error: "Tweet non trouvé",
    });
  }

  res.json({
    success: true,
    data: tweet,
  });
});

// Supprimer un tweet
exports.deleteTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return res.status(404).json({
      success: false,
      error: "Tweet non trouvé",
    });
  }

  // Vérifier que l'utilisateur est l'auteur du tweet
  if (tweet.id_user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      error: "Non autorisé à supprimer ce tweet",
    });
  }

  await Tweet.deleteOne(tweet);
  res.json({
    success: true,
    message: "Tweet supprimé",
  });
});

// Liker un tweet
exports.likeTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return res.status(404).json({
      success: false,
      error: "Tweet non trouvé",
    });
  }

  await tweet.like(req.user._id);
  res.json({
    success: true,
    message: "Tweet liké",
  });
});

// Unliker un tweet
exports.unlikeTweet = asyncHandler(async (req, res) => {
  const tweet = await Tweet.findById(req.params.id);

  if (!tweet) {
    return res.status(404).json({
      success: false,
      error: "Tweet non trouvé",
    });
  }

  await tweet.unlike(req.user._id);
  res.json({
    success: true,
    message: "Like retiré",
  });
});

// Rechercher des tweets
exports.searchTweets = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const tweets = await Tweet.find(
    { $text: { $search: q } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" }, created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("id_user", "username avatar");

  res.json({
    success: true,
    count: tweets.length,
    data: tweets,
  });
});

exports.retweet = asyncHandler(async (req, res) => {
  const { type, quoteContent } = req.body;

  const retweet = new Retweet({
    user: req.user._id,
    originalTweet: req.params.id,
    type,
    quoteContent,
  });

  await retweet.save();
  res.status(201).json(retweet);
});

exports.comment = asyncHandler(async (req, res) => {
  const { content, media } = req.body;

  const comment = new Comment({
    content,
    author: req.user._id,
    tweet: req.params.id,
    media,
  });

  await comment.save();
  res.status(201).json(comment);
});

exports.bookmark = asyncHandler(async (req, res) => {
  const { notes, collections } = req.body;

  const bookmark = new Bookmark({
    user: req.user._id,
    tweet: req.params.id,
    notes,
    collections,
  });

  await bookmark.save();
  res.status(201).json(bookmark);
});
