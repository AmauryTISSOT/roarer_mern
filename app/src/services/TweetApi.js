import axios from "axios";
import config from "./config";

// Créer une instance axios avec une configuration de base
const API = axios.create({
    baseURL: `${config.API_BASE_URL}`,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Services pour les tweets
export const TweetApi = {
    // Récupérer tous les tweets (feed)
    getFeed: (page = 1, limit = 20) => {
        return API.get(`api/tweets?page=${page}&limit=${limit}`);
    },

    // Rechercher des tweets
    searchTweets: (query, page = 1, limit = 20) => {
        return API.get(
            `api/tweets/search?q=${encodeURIComponent(
                query
            )}&page=${page}&limit=${limit}`
        );
    },

    // Récupérer un tweet spécifique
    getTweet: (id) => {
        return API.get(`api/tweets/${id}`);
    },

    // Créer un tweet
    createTweet: (tweetData) => {
        return API.post("/api/tweets", tweetData);
    },

    // Supprimer un tweet
    deleteTweet: (id) => {
        return API.delete(`api/tweets/${id}`);
    },

    // Liker un tweet
    likeTweet: (id) => {
        return API.put(`api/tweets/${id}/like`);
    },

    // Unliker un tweet
    unlikeTweet: (id) => {
        return API.delete(`api/tweets/${id}/like`);
    },

    // Retweeter un tweet
    retweet: (id, retweetData) => {
        return API.post(`api/tweets/${id}/retweet`, retweetData);
    },

    // Commenter un tweet
    comment: (id, commentData) => {
        return API.post(`api/tweets/${id}/comment`, commentData);
    },

    // Marquer un tweet
    bookmark: (id, bookmarkData) => {
        return API.post(`api/tweets/${id}/bookmark`, bookmarkData);
    },
};

export default API;
