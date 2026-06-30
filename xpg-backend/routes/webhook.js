const { Router } = require('express');
const { updateOrderStatus } = require('../services/storage');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { id, status, external_id } = req.body;
    console.log('Webhook received:', { xendit_id: id, status, order_id: external_id });

    const statusMap = {
      'PAID': 'paid',
      'EXPIRED': 'expired',
      'FAILED': 'failed',
      'SETTLED': 'paid'
    };

    const mappedStatus = statusMap[status] || status?.toLowerCase();

    if (external_id && mappedStatus) {
      await updateOrderStatus(external_id, mappedStatus);
      console.log(`Order ${external_id} updated to ${mappedStatus}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).json({ received: true });
  }
});

module.exports = router;
