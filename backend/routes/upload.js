const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configuration pour le stockage des images
const uploadsDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // limite à 5MB
  fileFilter: function(req, file, cb) {
    // Accepter seulement les formats d'images
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seuls les fichiers images sont acceptés.'), false);
    }
    cb(null, true);
  }
});

// Route pour l'upload d'images
router.post('/', upload.array('images', 10), (req, res) => {
  try {
    const uploadedFiles = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });
    
    res.json({ 
      success: true, 
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
