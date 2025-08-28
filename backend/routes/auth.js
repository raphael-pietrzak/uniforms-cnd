const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');

const { 
  generateTokens, 
  verifyRefreshToken, 
  invalidateToken, 
  cleanupExpiredTokens,
  setAuthCookies,
  clearAuthCookies
} = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Limiter pour prévenir les attaques par force brute
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: { error: 'Trop de tentatives de connexion. Veuillez réessayer après 15 minutes.' }
});

// Nettoyage périodique des tokens expirés (une fois par jour)
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);

// Validation pour l'inscription
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial')
];

// Validation pour la connexion
const loginValidation = [
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis')
];

// Route d'inscription
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await db('users').where({ username }).first();
    if (existingUsername) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà utilisé' });
    }
    
    // Hasher le mot de passe avec un coût plus élevé pour la sécurité
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Insérer l'utilisateur
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      role: 'user'
    }).returning('id');

    console.log('Nouvel utilisateur créé avec ID:', userId);
        
    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(userId);
    
    // Stocker le refresh token dans la base de données
    await db('refresh_tokens').insert({
      user_id: userId.id,
      token: refreshToken,
      created_at: new Date().toISOString()
    });
    
    // Définir les cookies d'authentification
    setAuthCookies(res, accessToken, refreshToken);
    
    res.status(201).json({
      user: { id: userId.id, username, email, role: 'user' },
      accessToken: accessToken
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route de connexion
router.post('/login', loginValidation, loginLimiter, async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await db('users').where({ email }).first();
    if (!user) {
      // Utiliser un message d'erreur générique pour ne pas divulguer d'informations
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // Même message d'erreur pour ne pas indiquer si c'est l'email ou le mot de passe qui est incorrect
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Stocker le refresh token dans la base de données
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      created_at: new Date().toISOString()
    });
    
    // Définir les cookies d'authentification
    setAuthCookies(res, accessToken, refreshToken);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: accessToken
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
  }
});

// Route pour rafraîchir le token
router.post('/refresh-token', async (req, res) => {
  try {
    // Récupérer le refresh token du cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token manquant' });
    }
    
    try {
      // Vérifier le refresh token
      const decoded = await verifyRefreshToken(refreshToken);
      
      // Invalider l'ancien token
      await invalidateToken(decoded.id, refreshToken);
      
      // Générer de nouveaux tokens
      const newTokens = generateTokens(decoded.id);

      // Stocker le nouveau refresh token
      await db('refresh_tokens').insert({
        user_id: decoded.id,
        token: newTokens.refreshToken,
        created_at: new Date().toISOString()
      });
      
      // Définir les nouveaux cookies
      setAuthCookies(res, newTokens.accessToken, newTokens.refreshToken);
      
      const user = await db('users').where({ id: decoded.id }).first();
      const userResponse = { id: decoded.id, username: user.username, email: user.email, role: user.role };

      res.json({ success: true, accessToken: newTokens.accessToken, user: userResponse });
    } catch (error) {
      console.error('Erreur token:', error.message);
      return res.status(401).json({ error: 'Refresh token invalide' });
    }
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  try {
    // Récupérer le refresh token du cookie
    const refreshToken = req.cookies.refreshToken;
    
    if (refreshToken) {
      // Supprimer le refresh token de la base de données
      await invalidateToken(null, refreshToken);
    }
    
    // Supprimer les cookies d'authentification
    clearAuthCookies(res);
    
    res.json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la déconnexion' });
  }
});

// Route pour demander la réinitialisation du mot de passe
router.post('/forgot-password',
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  async (req, res) => {
    try {
      // Vérifier les erreurs de validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { email } = req.body;
      
      // Vérifier si l'utilisateur existe
      const user = await db('users').where({ email }).first();
      if (!user) {
        // Ne pas indiquer si l'email existe ou non pour des raisons de sécurité
        return res.json({ 
          message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation'
        });
      }
      
      // Générer un token de réinitialisation (valide 1 heure)
      const resetToken = jwt.sign(
        { id: user.id, action: 'reset_password' },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
      );
      
      // Stocker le token dans la base de données
      await db('password_reset_tokens').insert({
        user_id: user.id,
        token: resetToken,
        expires_at: new Date(Date.now() + 3600000).toISOString() // +1 heure
      });
      
      // Dans une application réelle, envoyer un email avec le lien de réinitialisation
      // contenant le token. Ici, on simule cela en retournant le token dans la réponse.
      
      // NOTE: Dans un environnement de production, envoyez un email au lieu de retourner le token
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      // Pour la démo, on renvoie directement le lien
      res.json({
        message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation',
        // Supprimer la ligne suivante en production:
        resetLink: resetLink
      });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour réinitialiser le mot de passe
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token requis'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { token, password } = req.body;
    
    try {
      // Vérifier si le token existe et n'est pas expiré
      const resetRecord = await db('password_reset_tokens')
        .where({ token })
        .where('expires_at', '>', new Date().toISOString())
        .first();
        
      if (!resetRecord) {
        return res.status(400).json({ error: 'Lien de réinitialisation invalide ou expiré' });
      }
      
      // Vérifier la validité du token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      if (decoded.action !== 'reset_password' || decoded.id !== resetRecord.user_id) {
        return res.status(400).json({ error: 'Token invalide' });
      }
      
      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Mettre à jour le mot de passe de l'utilisateur
      await db('users')
        .where({ id: decoded.id })
        .update({
          password: hashedPassword,
          updated_at: new Date().toISOString()
        });
      
      // Supprimer le token de réinitialisation
      await db('password_reset_tokens')
        .where({ token })
        .delete();
      
      // Supprimer tous les refresh tokens de l'utilisateur
      // (déconnexion de toutes les sessions)
      await db('refresh_tokens')
        .where({ user_id: decoded.id })
        .delete();
      
      res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error('Erreur token:', error.message);
      return res.status(400).json({ error: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
