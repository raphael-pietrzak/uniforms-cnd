const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});




const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';


// Import des routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const sumupRoutes = require('./routes/sumup');
const telegramRoutes = require('./routes/telegram'); 

// Création de l'application Express
const app = express();

app.set('trust proxy', true)

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173'],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Important permet l'envoi de cookies avec CORS
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Configuration du middleware pour les webhooks SumUp (doit être avant express.json())
app.use('/api/sumup/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser()); // Middleware pour analyser les cookies


// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sumup', sumupRoutes);
app.use('/api/telegram', telegramRoutes);

// Route de base pour tester l'API
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API CND-Uniformes' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Une erreur est survenue sur le serveur'
  });
});

// Configuration du port
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur le port ${PORT} (${process.env.NODE_ENV.toUpperCase() || 'DEVELOPMENT'})`);
  console.log(`🌐 URL API test : http://localhost:${PORT}/api`);
});

module.exports = app;
