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

// Services pour les signets (bookmarks)
const bookmarkApi = {
    // Récupérer tous les signets
    getBookmarks: (collection = null) => {
        let url = `/bookmarks`;
        if (collection) {
            url += `&collection=${encodeURIComponent(collection)}`;
        }
        return API.get(url);
    },

    // Ajouter un tweet aux signets
    addBookmark: (tweetId) => {
        console.log(tweetId);
        return API.post(`/bookmarks/${tweetId}`);
    },

    // Supprimer un tweet des signets
    removeBookmark: (tweetId) => {
        return API.delete(`/bookmarks/tweet/${tweetId}`);
    },

    // Mettre à jour un signet
    updateBookmark: (tweetId, data) => {
        return API.put(`/bookmarks/tweet/${tweetId}`, data);
    },

    // Récupérer toutes les collections
    getCollections: () => {
        return API.get("/bookmarks/collections");
    },

    // Ajouter un tweet à une collection
    addToCollection: (tweetId, collection) => {
        return API.post(`/bookmarks/tweet/${tweetId}/collections`, {
            collection,
        });
    },

    // Retirer un tweet d'une collection
    removeFromCollection: (tweetId, collection) => {
        return API.delete(
            `/bookmarks/tweet/${tweetId}/collections/${collection}`
        );
    },
};

export default bookmarkApi;
