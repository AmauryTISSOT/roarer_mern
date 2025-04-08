const Bookmark = require("../models/Bookmark");
const Tweet = require("../models/Tweet");

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.addBookmark = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { notes, collections } = req.body;

  // Vérifie si le tweet existe
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    return res.status(404).json({ message: "Tweet non trouvé" });
  }

  // Vérifie si le bookmark existe déjà
  const existingBookmark = await Bookmark.findOne({
    user: req.user._id,
    tweet: tweetId,
  });

  if (existingBookmark) {
    return res.status(400).json({ message: "Tweet déjà dans les signets" });
  }

  // Crée le nouveau bookmark
  const bookmark = new Bookmark({
    user: req.user._id,
    tweet: tweetId,
    notes,
    collections: collections || ["Default"],
  });

  await bookmark.save();

  // Incrémente le compteur de bookmarks du tweet
  await Tweet.findByIdAndUpdate(tweetId, {
    $inc: { "metrics.bookmarkCount": 1 },
  });

  res.status(201).json(bookmark);
});

exports.removeBookmark = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const bookmark = await Bookmark.findOneAndDelete({
    user: req.user._id,
    tweet: tweetId,
  });

  if (!bookmark) {
    return res.status(404).json({ message: "Signet non trouvé" });
  }

  // Décrémenter le compteur de signets du tweet
  await Tweet.findByIdAndUpdate(tweetId, {
    $inc: { "metrics.bookmarkCount": -1 },
  });

  res.json({ message: "Signet supprimé avec succès" });
});

exports.getBookmarks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const collection = req.query.collection;

  let query = { user: req.user._id };
  if (collection) {
    query.collections = collection;
  }

  const bookmarks = await Bookmark.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: "tweet",
      populate: { path: "id_user", select: "name avatar" },
    });

  res.json(bookmarks);
});

exports.updateBookmark = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { notes, collections } = req.body;

  const bookmark = await Bookmark.findOne({
    user: req.user._id,
    tweet: tweetId,
  });

  if (!bookmark) {
    return res.status(404).json({ message: "Signet non trouvé" });
  }

  if (notes) bookmark.notes = notes;
  if (collections) bookmark.collections = collections;

  await bookmark.save();
  res.json(bookmark);
});

exports.getCollections = asyncHandler(async (req, res) => {
  const collections = await Bookmark.distinct("collections", {
    user: req.user._id,
  });

  res.json(collections);
});

exports.addToCollection = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { collection } = req.body;

  const bookmark = await Bookmark.findOne({
    user: req.user._id,
    tweet: tweetId,
  });

  if (!bookmark) {
    return res.status(404).json({ message: "Signet non trouvé" });
  }

  if (!bookmark.collections.includes(collection)) {
    bookmark.collections.push(collection);
    await bookmark.save();
  }

  res.json(bookmark);
});

exports.removeFromCollection = asyncHandler(async (req, res) => {
  const { tweetId, collection } = req.params;

  const bookmark = await Bookmark.findOne({
    user: req.user._id,
    tweet: tweetId,
  });

  if (!bookmark) {
    return res.status(404).json({ message: "Signet non trouvé" });
  }

  bookmark.collections = bookmark.collections.filter((c) => c !== collection);
  if (bookmark.collections.length === 0) {
    bookmark.collections = ["Default"];
  }

  await bookmark.save();
  res.json(bookmark);
});
