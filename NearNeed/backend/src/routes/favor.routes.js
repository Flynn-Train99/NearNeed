const express = require('express');
const router = express.Router();

router.get('/user/:id', (req, res) => {
  res.status(200).json({ message: 'Get user favors endpoint - to be implemented' });
});

router.patch('/:id', (req, res) => {
  res.status(200).json({ message: 'Update favor status endpoint - to be implemented' });
});

router.post('/disputes', (req, res) => {
  res.status(200).json({ message: 'Create dispute endpoint - to be implemented' });
});

module.exports = router;