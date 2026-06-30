const { Router } = require('express');
const { getBalance } = require('../services/xendit');

const router = Router();

router.get('/', async (req, res) => {
  try {
    const balance = await getBalance();
    res.json(balance);
  } catch (error) {
    console.error('Balance error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
