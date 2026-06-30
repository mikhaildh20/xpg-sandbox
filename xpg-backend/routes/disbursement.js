const { Router } = require('express');
const { createDisbursement, getDisbursement } = require('../services/xendit');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { amount, bank_code, account_number, account_name, description } = req.body;

    if (!amount || !bank_code || !account_number || !account_name) {
      return res.status(400).json({
        error: 'Required fields: amount, bank_code, account_number, account_name'
      });
    }

    const result = await createDisbursement(amount, bank_code, account_number, account_name, description);
    res.json(result);
  } catch (error) {
    console.error('Disbursement error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await getDisbursement(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Get disbursement error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
