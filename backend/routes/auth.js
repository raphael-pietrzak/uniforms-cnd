const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/database');
const { generateTokens, verifyRefreshToken } = require('../middleware/auth');

const router = express.Router();

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insérer l'utilisateur
    const [userId] = await db('users').insert({
      username,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
      role: 'user' // Par défaut, un nouvel utilisateur a le rôle "user"
    });
    
    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(userId);
    
    // Stocker le refresh token dans la base de données
    await db('refresh_tokens').insert({
      user_id: userId,
      token: refreshToken,
      created_at: new Date().toISOString()
    });
    
    res.status(201).json({
      user: { id: userId, username, email, role: 'user' },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Trouver l'utilisateur
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }
    
    // Générer les tokens
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Stocker le refresh token dans la base de données
    await db('refresh_tokens').insert({
      user_id: user.id,
      token: refreshToken,
      created_at: new Date().toISOString()
    });
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      tokens: { accessToken, refreshToken }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour rafraîchir le token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requis' });
    }
    
    // Vérifier le refresh token
    const decoded = await verifyRefreshToken(refreshToken);
    
    // Générer de nouveaux tokens
    const newTokens = generateTokens(decoded.id);
    
    // Mettre à jour le refresh token dans la base de données
    await db('refresh_tokens')
      .where({ user_id: decoded.id, token: refreshToken })
      .delete();
      
    await db('refresh_tokens').insert({
      user_id: decoded.id,
      token: newTokens.refreshToken,
      created_at: new Date().toISOString()
    });
    
    res.json({ tokens: newTokens });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(401).json({ error: 'Refresh token invalide' });
  }
});

// Route de déconnexion
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requis' });
    }
    
    // Supprimer le refresh token de la base de données
    await db('refresh_tokens').where({ token: refreshToken }).delete();
    
    res.json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
