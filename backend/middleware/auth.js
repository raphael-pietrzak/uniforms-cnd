const jwt = require('jsonwebtoken');
const db = require('../config/database');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_default';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_default';

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Token non fourni' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré', expired: true });
    }
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Génération des tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
  return { accessToken, refreshToken };
};

// Vérifier un refresh token
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    
    // Vérifier si le token existe dans la base de données
    const storedToken = await db('refresh_tokens')
      .where({ user_id: decoded.id, token: token })
      .first();
    
    if (!storedToken) {
      throw new Error('Token invalide ou révoqué');
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  verifyToken,
  generateTokens,
  verifyRefreshToken
};
