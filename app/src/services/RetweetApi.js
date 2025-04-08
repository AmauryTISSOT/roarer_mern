import axios from "axios";
import config from "./config.js";

const API = axios.create({
  baseURL: `${config.API_BASE_URL}`,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Ajouter un interceptor pour inclure automatiquement le token d'authentification
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Vérifie si un token est stocké
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const RetweetApi = {
  getRetweet: async () => {
    try {
      const response = await API.get("/api/retweets/user");

      // Vérifie si la réponse contient bien une liste de retweets
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.error("Format de données inattendu:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Erreur API:", error);
      throw error;
    }
  },
};
