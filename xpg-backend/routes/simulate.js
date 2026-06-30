const { Router } = require('express');
const { updateOrderStatus, getOrder } = require('../services/storage');

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { order_id, status } = req.body;
    if (!order_id) {
      return res.status(400).json({ error: 'order_id is required' });
    }

    const order = await getOrder(order_id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const newStatus = status === 'paid' ? 'paid' : 'failed';
    await updateOrderStatus(order_id, newStatus);

    console.log(`Simulate: Order ${order_id} -> ${newStatus}`);

    res.json({
      success: true,
      order_id,
      status: newStatus,
      message: newStatus === 'paid'
        ? 'Pembayaran berhasil! Terima kasih!'
        : 'Pembayaran gagal. Silakan coba lagi.'
    });
  } catch (error) {
    console.error('Simulate error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
