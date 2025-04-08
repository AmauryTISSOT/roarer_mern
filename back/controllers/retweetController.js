const Tweet = require("../models/Tweet");
const Retweet = require("../models/Retweet");
const notificationController = require('./notificationController');

// Gestionnaire d'erreurs asynchrone
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Créer un retweet
exports.createRetweet = asyncHandler(async (req, res) => {
  const { type, quoteContent } = req.body;
  const originalTweetId = req.params.tweetId;

  // Vérifier si le tweet original existe
  const originalTweet = await Tweet.findById(originalTweetId);
  if (!originalTweet) {
    return res.status(404).json({
      success: false,
      error: "Tweet original non trouvé",
    });
  }

  // Vérifier si l'utilisateur a déjà retweeté ce tweet
  const existingRetweet = await Retweet.findOne({
    user: req.user._id,
    originalTweet: originalTweetId,
  });

  if (existingRetweet) {
    return res.status(400).json({
      success: false,
      error: "Vous avez déjà retweeté ce tweet",
    });
  }

  // Créer le retweet
  const retweet = new Retweet({
    user: req.user._id,
    originalTweet: originalTweetId,
    type,
    quoteContent: type === "quote" ? quoteContent : undefined,
    created_at: new Date(),
  });

  await retweet.save();

  // Peupler les références pour la réponse
  await retweet.populate([
    { path: "user", select: "username avatar" },
    {
      path: "originalTweet",
      populate: { path: "id_user", select: "username avatar" },
    },
  ]);

  await notificationController.createNotification({
    user: tweet.id_user, 
    type: 'comment',
    content: `${user.name} a retweet votre tweet`,
    tweet: tweet._id
  });

  res.status(201).json({
    success: true,
    data: retweet,
  });
});

// Supprimer un retweet
exports.deleteRetweet = asyncHandler(async (req, res) => {
  const originalTweetId = req.params.tweetId;

  // Trouver et vérifier le retweet
  const retweet = await Retweet.findOne({
    user: req.user._id,
    originalTweet: originalTweetId,
  });

  if (!retweet) {
    return res.status(404).json({
      success: false,
      error: "Retweet non trouvé",
    });
  }

  await retweet.remove();

  res.json({
    success: true,
    message: "Retweet supprimé avec succès",
  });
});

// Obtenir les retweets d'un tweet
exports.getTweetRetweets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const retweets = await Retweet.find({ originalTweet: req.params.tweetId })
    .populate("user", "username avatar")
    .populate("originalTweet")
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    count: retweets.length,
    data: retweets,
  });
});

// Obtenir les retweets d'un utilisateur
exports.getUserRetweets = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const retweets = await Retweet.find({ user: req.user._id })
    .populate("originalTweet")
    .populate("user", "username avatar")
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    count: retweets.length,
    data: retweets,
  });
});

// Liker un retweet
exports.likeRetweet = asyncHandler(async (req, res) => {
  const retweet = await Retweet.findById(req.params.retweetId);

  if (!retweet) {
    return res.status(404).json({
      success: false,
      error: "Retweet non trouvé",
    });
  }

  await retweet.like(req.user._id);
  res.json({
    success: true,
    message: "Retweet liké",
  });
});

// Unliker un retweet
exports.unlikeRetweet = asyncHandler(async (req, res) => {
  const retweet = await Retweet.findById(req.params.retweetId);

  if (!retweet) {
    return res.status(404).json({
      success: false,
      error: "Retweet non trouvé",
    });
  }

  await retweet.unlike(req.user._id);
  res.json({
    success: true,
    message: "Like retiré du retweet",
  });
});
