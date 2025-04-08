const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    // Récupérer l'en-tête d'autorisation
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Accès refusé : aucun token fourni" });
    }
  
    // Extraire le token (la partie après "Bearer ")
    const token = authHeader.split(" ")[1];
  
    try {
      // Vérifier le token et récupérer les données encodées
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Récupérer l'utilisateur à partir de son ID contenu dans le token
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      // Ajouter l'utilisateur à l'objet req pour qu'il soit accessible dans les routes suivantes
      req.user = user;
      next();
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return res.status(401).json({ error: "Token invalide" });
    }
  };

module.exports = protect;
