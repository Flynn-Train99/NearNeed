const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
  res.status(200).json({ message: 'Create payment endpoint - to be implemented' });
});

router.post('/refund', (req, res) => {
  res.status(200).json({ message: 'Refund payment endpoint - to be implemented' });
});

module.exports = router;