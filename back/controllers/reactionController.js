const Reaction = require("../models/Reaction");

// Gestionnaire d'erreurs asynchrone
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

exports.bulkInsertReactions = asyncHandler(async (req, res) => {
    const reactions = req.body; 

    // console.log(reactions);

    let reactionsArray = Object.values(reactions).map(({ user, post, label }) => ({
        userId: user,
        postId: post,
        label: label
    }));

    // console.log(reactionsArray);

    if (!Array.isArray(reactionsArray) || reactionsArray.length === 0) {
        res.status(400);
        throw new Error("Aucune réaction fournie");
    }

    try {
        const insertedReactions = await Reaction.insertMany(reactionsArray, { ordered: false });

        res.status(201).json({
            success: true,
            message: `${insertedReactions.length} réactions insérées`,
            data: insertedReactions,
        });

    } catch (error) {
        console.error("Erreur d'insertion:", error);
        res.status(207).json({
            success: false,
            message: "Certaines réactions n'ont pas pu être insérées (doublons ?)",
            error: error.writeErrors || error.message,
        });
    }
});

// getter
exports.getAllReactions = asyncHandler(async (req, res) => {
    try {
        const reactions = await Reaction.find(); 
        res.status(200).json({
            success: true,
            data: reactions,
        });
    } catch (error) {
        console.error("Erreur de récupération des réactions:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des réactions",
            error: error.message,
        });
    }
});

exports.getReactionsByPost = asyncHandler(async (req, res) => {
    const { postId } = req.params; 

    try {
        const reactions = await Reaction.find({ postId }); 
        if (reactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Aucune réaction trouvée pour le postId: ${postId}`,
            });
        }

        res.status(200).json({
            success: true,
            data: reactions,
        });
    } catch (error) {
        console.error("Erreur de récupération des réactions par postId:", error);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des réactions par postId",
            error: error.message,
        });
    }
});