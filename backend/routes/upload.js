const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuration de Multer pour stocker localement
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Générer un nom de fichier unique avec timestamp et nom original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite à 5MB
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seuls les fichiers images sont acceptés.'), false);
    }
    cb(null, true);
  }
});

// Route pour l'upload d'images - doit être authentifié comme admin
router.post('/', verifyToken, verifyAdmin, upload.array('images', 10), async (req, res) => {
  try {
    // Récupérer les URLs des fichiers uploadés
    const uploadedUrls = req.files.map(file => {
      // Retourner l'URL relative pour accéder au fichier
      return `/uploads/${file.filename}`;
    });
    
    res.json({ 
      success: true, 
      files: uploadedUrls 
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
