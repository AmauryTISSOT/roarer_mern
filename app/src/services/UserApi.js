import config from "./config";
const API_BASE_URL = config.API_BASE_URL;
import axios from "axios";

const UserApi = {
  /**
   * Inscription d'un utilisateur
   * @param {Object} userData - { name, email, password }
   * @returns {Promise} - Réponse de l'API
   */
  register: async (userData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur inconnue" };
    }
  },

  /**
   * Connexion d'un utilisateur
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - Réponse de l'API
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur inconnue" };
    }
  },
  /**
   *Récupérer le profil de l'utilisateur
   * @param {string} token - Le token d'authentification JWT
   * @returns {Promise} - Données du profil de l'utilisateur
   */
  getProfile: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur inconnue lors de la récupération du profil",
        }
      );
    }
  },
  /**
   * Recherche d'utilisateur
   * @param {string} searchQuery - Le terme de recherche
   * @return {Promise} - liste des utilisateurs correspondants
   */

  searchUsers: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la récupération des utilisateurs",
        }
      );
    }
  },
};

export default UserApi;
