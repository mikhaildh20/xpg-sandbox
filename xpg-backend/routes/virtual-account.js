const { Router } = require('express');
const { createVirtualAccount, getVirtualAccount } = require('../services/xendit');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { name, bank_code, external_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const result = await createVirtualAccount(name, bank_code, external_id);
    res.json(result);
  } catch (error) {
    console.error('VA error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await getVirtualAccount(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Get VA error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
