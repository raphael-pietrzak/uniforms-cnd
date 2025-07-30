const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const SECRETARY_PHONE_NUMBER = process.env.SECRETARY_PHONE_NUMBER;


// Import des routes
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const stripeRoutes = require('./routes/stripe');
const whatsappRoutes = require('./routes/whatsapp');
const { verifyAdmin, verifyToken } = require('./middleware/auth');


// Création de l'application Express
const app = express();

app.get('/ping', (req, res) => {
  res.send('pong');
});

// Configuration du middleware pour les webhooks Stripe (doit être avant express.json())
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cors({
  origin: "https://uniforms-cnd.vercel.app" || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/whatsapp', whatsappRoutes);

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
  console.log(`✅ Serveur en écoute sur le port ${PORT}`);
  console.log(`🌐 URL API test : http://localhost:${PORT}/api`);
});

module.exports = app;
