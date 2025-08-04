const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Utilisation de variables d'environnement pour les secrets
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-key-should-be-in-env';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-key-should-be-in-env';

// Configuration des durées d'expiration
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 jours

// Génération des tokens d'accès et de rafraîchissement
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  
  return { accessToken, refreshToken };
};

// Vérification du token d'accès
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Accès non autorisé: token manquant' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      
      // Vérifier si l'utilisateur existe toujours
      const user = await db('users').where({ id: decoded.id }).first();
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }
      
      req.user = {
        id: decoded.id,
        role: user.role
      };
      
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expiré',
          code: 'TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({ error: 'Token invalide' });
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'authentification' });
  }
};

// Vérification du token de rafraîchissement
const verifyRefreshToken = async (token) => {
  try {
    // Vérifier si le token existe dans la base de données
    const tokenRecord = await db('refresh_tokens').where({ token }).first();
    if (!tokenRecord) {
      throw new Error('Token de rafraîchissement non trouvé');
    }
    
    // Vérifier la validité du token
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    
    // Vérifier que l'ID utilisateur correspond
    if (decoded.id !== tokenRecord.user_id) {
      throw new Error('Token invalide');
    }
    
    // Vérifier si l'utilisateur existe toujours
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Middleware pour vérifier le rôle administrateur
const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé: privilèges d\'administrateur requis' });
  }
};

// Vérifier l'accès utilisateur à ses propres ressources
const verifyResourceOwnership = (resourceField) => async (req, res, next) => {
  try {
    // Si l'utilisateur est un administrateur, autoriser l'accès
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Vérifier si la ressource appartient à l'utilisateur
    const resourceId = req.params.id;
    const resource = await db(resourceField).where({ id: resourceId }).first();
    
    if (!resource) {
      return res.status(404).json({ error: 'Ressource non trouvée' });
    }
    
    if (resource.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès refusé: vous n\'êtes pas autorisé à accéder à cette ressource' });
    }
    
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du propriétaire:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Invalidation de token
const invalidateToken = async (userId, token) => {
  try {
    await db('refresh_tokens').where({ 
      user_id: userId,
      token: token 
    }).delete();
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'invalidation du token:', error);
    return false;
  }
};

// Nettoyer les tokens expirés
const cleanupExpiredTokens = async () => {
  try {
    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() - 7); // Supprimer les tokens de plus de 7 jours
    
    await db('refresh_tokens')
      .where('created_at', '<', expiryDate.toISOString())
      .delete();
      
    console.log('Nettoyage des tokens expirés terminé');
  } catch (error) {
    console.error('Erreur lors du nettoyage des tokens expirés:', error);
  }
};

module.exports = {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  verifyAdmin,
  verifyResourceOwnership,
  invalidateToken,
  cleanupExpiredTokens
};
