const { Router } = require('express');
const { createPaymentLink } = require('../services/xendit');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { amount, description, external_id } = req.body;

    if (!amount || !description) {
      return res.status(400).json({ error: 'amount and description are required' });
    }

    const result = await createPaymentLink(amount, description, external_id);
    res.json(result);
  } catch (error) {
    console.error('Payment Link error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
