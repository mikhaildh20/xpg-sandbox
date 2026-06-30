const { Router } = require('express');
const { generateReport } = require('../services/xendit');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, from_date, to_date } = req.body;

    const result = await generateReport(type, from_date, to_date);
    res.json(result);
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
