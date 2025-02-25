const express = require('express');
const router = express.Router();

router.post('/subscribe', (req, res) => {
  res.status(200).json({ message: 'Subscribe to premium endpoint - to be implemented' });
});

router.post('/cancel', (req, res) => {
  res.status(200).json({ message: 'Cancel subscription endpoint - to be implemented' });
});

module.exports = router;