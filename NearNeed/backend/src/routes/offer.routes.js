const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.status(200).json({ message: 'Create offer endpoint - to be implemented' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: 'Get offer by ID endpoint - to be implemented' });
});

router.patch('/:id/complete', (req, res) => {
  res.status(200).json({ message: 'Complete offer endpoint - to be implemented' });
});

module.exports = router;