import axios from "axios";
import config from "./config";

// Créer une instance axios avec une configuration de base
const API = axios.create({
    baseURL: `${config.API_BASE_URL}/api`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Services pour les commentaires
export const commentApi = {
    // Récupérer les commentaires d'un tweet
    getComments: (tweetId, page = 1, limit = 20) => {
        return API.get(
            `/comments/tweet/${tweetId}?page=${page}&limit=${limit}`
        );
    },

    // Récupérer les réponses à un commentaire
    getReplies: (commentId, page = 1, limit = 20) => {
        return API.get(
            `/comments/${commentId}/replies?page=${page}&limit=${limit}`
        );
    },

    // Créer un commentaire sur un tweet
    createComment: (tweetId, commentData) => {
        return API.post(`/comments/tweet/${tweetId}`, commentData);
    },

    // Répondre à un commentaire
    replyToComment: (commentId, replyData) => {
        return API.post(`/comments/${commentId}/reply`, replyData);
    },

    // Supprimer un commentaire
    deleteComment: (commentId) => {
        return API.delete(`/comments/${commentId}`);
    },

    // Liker un commentaire
    likeComment: (commentId) => {
        return API.put(`/comments/${commentId}/like`);
    },

    // Unliker un commentaire
    unlikeComment: (commentId) => {
        return API.delete(`/comments/${commentId}/like`);
    },
};
