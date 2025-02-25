const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get notifications endpoint - to be implemented' });
});

router.patch('/:id/read', (req, res) => {
  res.status(200).json({ message: 'Mark notification as read endpoint - to be implemented' });
});

module.exports = router;