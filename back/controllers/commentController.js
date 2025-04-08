const Comment = require("../models/Comment");
const Tweet = require("../models/Tweet");
const notificationController = require('./notificationController');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.createComment = asyncHandler(async (req, res) => {
  const { content, media } = req.body;
  const { tweetId } = req.params;

  // Vérifier si le tweet existe
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).json({ message: "Tweet non trouvé" });
  }

  const comment = new Comment({
    content,
    author: req.user._id,
    tweet: tweetId,
    media,
  });

  await comment.save();

  await notificationController.createNotification({
    user: tweet.id_user, 
    type: 'comment',
    content: `${user.name} a commenté votre tweet`,
    tweet: tweet._id
  });

  // Populate l'auteur pour la réponse
  await comment.populate("author", "username avatar");

  res.status(201).json(comment);
});

exports.getComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  const comments = await Comment.find({ tweet: tweetId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "username avatar")
    .populate({
      path: "replies",
      populate: { path: "author", select: "username avatar" },
    });

  res.json(comments);
});

exports.getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  // D'abord récupérer le commentaire parent
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    return res.status(404).json({ message: "Commentaire non trouvé" });
  }

  const replies = await Comment.find({ _id: { $in: parentComment.replies } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "username avatar");

  res.json(replies);
});

exports.likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Commentaire non trouvé" });
  }

  if (!comment.likes.includes(req.user._id)) {
    comment.likes.push(req.user._id);
    await comment.save();
  }

  res.json({ message: "Commentaire liké avec succès" });
});

exports.unlikeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Commentaire non trouvé" });
  }

  comment.likes = comment.likes.filter(
    (userId) => userId.toString() !== req.user._id.toString()
  );
  await comment.save();

  res.json({ message: "Like retiré avec succès" });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return res.status(404).json({ message: "Commentaire non trouvé" });
  }

  if (comment.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  await comment.remove();
  res.json({ message: "Commentaire supprimé avec succès" });
});

exports.replyToComment = asyncHandler(async (req, res) => {
  const { content, media } = req.body;
  const { commentId } = req.params;

  const parentComment = await Comment.findById(commentId);
  if (!parentComment) {
    return res.status(404).json({ message: "Commentaire parent non trouvé" });
  }

  const reply = new Comment({
    content,
    author: req.user._id,
    tweet: parentComment.tweet,
    media,
    isReply: true,
  });

  await reply.save();

  // Ajouter la réponse au commentaire parent
  parentComment.replies.push(reply._id);
  await parentComment.save();

  await reply.populate("author", "username avatar");
  res.status(201).json(reply);
});
