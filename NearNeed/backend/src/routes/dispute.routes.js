const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Create dispute endpoint - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get dispute by ID endpoint - to be implemented' });
});

router.patch('/:id/resolve', (req, res) => {
  res.status(200).json({ message: 'Resolve dispute endpoint - to be implemented' });
});

module.exports = router;