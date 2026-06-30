const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;
const XENDIT_API = 'https://api.xendit.co/v2/invoices';

async function createInvoice(amount, description) {
  if (!XENDIT_SECRET_KEY) {
    console.warn('XENDIT_SECRET_KEY not set — returning mock invoice');
    return {
      invoice_url: `https://checkout.xendit.co/mock/${Date.now()}`,
      xendit_id: `mock_${Date.now()}`,
      status: 'pending',
      amount,
      description
    };
  }

  const auth = Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64');
  const response = await fetch(XENDIT_API, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount,
      description,
      currency: 'IDR',
      success_redirect_url: process.env.SUCCESS_REDIRECT_URL || 'http://localhost:3000'
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Xendit API error: ${err}`);
  }

  const data = await response.json();
  return {
    invoice_url: data.invoice_url,
    xendit_id: data.id,
    status: data.status,
    amount,
    description
  };
}

module.exports = { createInvoice };
