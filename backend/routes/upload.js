const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration de Multer pour stocker temporairement en mémoire
const storage = multer.memoryStorage();
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
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'cnd-uniformes' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    
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
