const OpenAI = require('openai');
const { createInvoice } = require('./xendit');
const { createOrder, createTransaction } = require('./storage');

const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.mimo-v2.com/v1';
const AI_MODEL = process.env.AI_MODEL || 'mimo-v2-pro';

let client = null;
function getClient() {
  if (!client && AI_API_KEY) {
    client = new OpenAI({
      apiKey: AI_API_KEY,
      baseURL: AI_BASE_URL,
    });
  }
  return client;
}

const SYSTEM_PROMPT = `Kamu adalah XenBot, asisten pembayaran virtual yang profesional, solutif, dan ringkas. Gunakan Bahasa Indonesia yang santai tapi sopan.

Tugasmu adalah mendengarkan perintah pembelian dari user, lalu mengekstrak informasi harga dan nama barang. Jika informasi lengkap, jalankan tool \`createXenditInvoice\`. Jangan pernah meminta uang asli. Ingatkan selalu user bahwa ini adalah lingkungan simulasi (Sandbox).

Aturan:
- Minimal transaksi: Rp 10.000
- Jika user memberi nominal minus/nol, tolak dengan sopan
- Jika user berbicara di luar topik belanja, arahkan kembali ke pembuatan invoice
- Selalu konfirmasi ke user sebelum membuat invoice`;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'createXenditInvoice',
      description: 'Membuat link pembayaran resmi menggunakan Xendit',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Jumlah pembayaran dalam Rupiah (min Rp10.000)' },
          description: { type: 'string', description: 'Deskripsi item yang dibayar' }
        },
        required: ['amount', 'description']
      }
    }
  }
];

function extractAmountFromText(text) {
  const numbers = text.match(/\d+/g);
  if (!numbers) return null;
  const parsed = numbers.map(n => parseInt(n));
  return Math.max(...parsed);
}

function extractDescriptionFromText(text) {
  const cleaned = text
    .replace(/(?:beli|buat|buatkan|tolong|saya ingin|mau)\s*/gi, '')
    .replace(/(?:rp|Rp|RP)?\s*[\d,.\s]+(?:rb|ribu)?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned || 'Pembayaran';
}

async function handleMessage(userMessage) {
  const ai = getClient();

  if (ai) {
    try {
      const response = await ai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        tools: TOOLS,
        tool_choice: 'auto',
      });

      const choice = response.choices[0];

      if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
        const toolCall = choice.message.tool_calls[0];
        if (toolCall.function.name === 'createXenditInvoice') {
          const args = JSON.parse(toolCall.function.arguments);
          return await executeInvoice(args.amount, args.description);
        }
      }

      return { reply: choice.message.content || 'Maaf, saya tidak dapat memproses permintaan Anda.' };
    } catch (error) {
      console.error('AI API error:', error.message);
      if (error.status) {
        console.error('Status:', error.status, 'Details:', JSON.stringify(error.data || {}));
      }
    }
  }

  return handleWithRegex(userMessage);
}

async function handleWithRegex(userMessage) {
  const amount = extractAmountFromText(userMessage);
  const description = extractDescriptionFromText(userMessage);

  if (!amount || amount <= 0) {
    return { reply: 'Maaf, saya tidak dapat menemukan nominal pembayaran yang valid. Silakan sebutkan jumlahnya, misalnya: "Beli sepatu Rp150.000"' };
  }

  if (amount < 10000) {
    return { reply: `Maaf, nominal pembayaran harus di atas Rp10.000 ya! Anda menyebutkan Rp${amount.toLocaleString('id-ID')}.` };
  }

  if (!description || description.length < 3) {
    return { reply: 'Baik, saya akan membuatkan invoice. Bisa sebutkan nama item yang ingin dibeli?' };
  }

  const paymentKeywords = ['beli', 'bayar', 'invoice', 'tagihan', 'transfer', 'pembayaran', 'transaksi', 'order', 'pesan', 'topup', 'top up', 'isi', 'pulsa', 'token', 'game', 'sepatu', 'baju', 'kopi', 'makanan', 'minuman'];
  const hasPaymentIntent = paymentKeywords.some(k => userMessage.toLowerCase().includes(k));

  if (!hasPaymentIntent) {
    return { reply: 'Saya di sini khusus untuk membantumu membuat invoice simulasi pembayaran Xendit. Ada yang bisa saya bantu terkait transaksi Anda?' };
  }

  return await executeInvoice(amount, description);
}

async function executeInvoice(amount, description) {
  try {
    const order = await createOrder(description, amount);
    const invoice = await createInvoice(amount, description, order.order_id);
    await createTransaction(order.order_id, invoice.xendit_id, invoice.invoice_url);

    return {
      reply: `Baik, saya sudah membuatkan invoice untuk *${description}* sebesar *Rp${amount.toLocaleString('id-ID')}*. Silakan klik link di bawah untuk melihat detail pembayaran (lingkungan Sandbox).`,
      invoice_url: invoice.invoice_url,
      amount,
      description,
      status: invoice.status,
      order_id: order.order_id
    };
  } catch (error) {
    console.error('Invoice creation error:', error);
    return { reply: `Maaf, terjadi kesalahan saat membuat invoice: ${error.message}. Silakan coba lagi.` };
  }
}

module.exports = { handleMessage };
