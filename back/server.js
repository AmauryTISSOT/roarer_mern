const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const http = require('http');
const socket = require('./socket');
const socketIo = require('socket.io');
const connectDB = require("./config/db"); // Import de la connexion MongoDB

// Charger les variables d’environnement
dotenv.config();

// Vérifier et créer le dossier uploads si nécessaire
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Connexion à MongoDB
const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ Connecté à MongoDB !");
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB :", error);
        process.exit(1);
    }
};
startServer();

// Initialiser l’application Express
const app = express();

// Créez le serveur HTTP en passant l'application Express
const server = http.createServer(app);
const io = socket.init(server);
app.set('io', io);

// Configuration de Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté :', socket.id);
  
  // Par exemple, inscrire l'utilisateur dans une room dédiée
  socket.on('register', (userId) => {
    socket.join(userId);
    console.log(`L'utilisateur ${userId} est enregistré dans sa room`);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté :', socket.id);
  });
});

// Middlewares globaux
app.use(express.json()); // Parser les JSON
app.use(cors());         // Autoriser les requêtes cross-origin
app.use(morgan("dev"));  // Logger les requêtes
app.use(express.urlencoded({ extended: true }));

// Servir les images
app.use("/uploads", express.static("uploads"));

// Import des routes
const routes = require("./routes/index");

// Déclaration des routes
app.use(routes);
 

console.log("✅ Routes utilisateur chargées !");

// Route principale
app.get("/", (req, res) => {
    res.send("🚀 Serveur backend opérationnel !");
});

// Lancer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🔥 Serveur démarré sur http://localhost:${PORT}`);
});
