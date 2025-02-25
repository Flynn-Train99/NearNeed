const express = require('express');
const router = express.Router();

router.post('/get-or-create', (req, res) => {
  res.status(200).json({ message: 'Get or create chat endpoint - to be implemented' });
});

router.post('/:id/messages', (req, res) => {
  res.status(200).json({ message: 'Send message endpoint - to be implemented' });
});

module.exports = router;