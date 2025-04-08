const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    postId: { type: String, required: true },
    label: { type: String, required: true }
});

reactionSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model("Reaction", reactionSchema);

