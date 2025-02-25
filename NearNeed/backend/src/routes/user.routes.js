const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  res.status(200).json({ message: 'Get user profile endpoint - to be implemented' });
});

router.patch('/profile', (req, res) => {
  res.status(200).json({ message: 'Update user profile endpoint - to be implemented' });
});

router.post('/upload-photo', (req, res) => {
  res.status(200).json({ message: 'Upload user photo endpoint - to be implemented' });
});

module.exports = router;