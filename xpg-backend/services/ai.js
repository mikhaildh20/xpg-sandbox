const OpenAI = require('openai');
const xendit = require('./xendit');
const { createOrder, createTransaction } = require('./storage');

const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
const AI_BASE_URL = process.env.AI_BASE_URL || 'https://api.xiaomimimo.com/v1';
const AI_MODEL = process.env.AI_MODEL || 'mimo-v2.5';

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

Kamu bisa membantu user dengan:
1. **Membuat Invoice** — dari perintah seperti "Beli sepatu Rp150.000"
2. **Cek Saldo** — ketika user bertanya tentang saldo akun
3. **Buat Virtual Account** — untuk pembayaran via VA bank
4. **Buat Payment Link** — link pembayaran yang bisa dibagikan
5. **Transfer/Disbursement** — kirim uang ke rekening bank
6. **Lihat Laporan** — generate laporan transaksi

Aturan:
- Minimal transaksi: Rp 10.000
- Jika user memberi nominal minus/nol, tolak dengan sopan
- Jika user berbicara di luar topik pembayaran, arahkan kembali
- Selalu konfirmasi ke user sebelum melakukan aksi penting
- Ingatkan selalu bahwa ini adalah lingkungan simulasi (Sandbox)`;

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'createXenditInvoice',
      description: 'Membuat link pembayaran invoice menggunakan Xendit',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Jumlah pembayaran dalam Rupiah (min Rp10.000)' },
          description: { type: 'string', description: 'Deskripsi item yang dibayar' }
        },
        required: ['amount', 'description']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'checkBalance',
      description: 'Cek saldo akun Xendit',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'createVirtualAccount',
      description: 'Membuat Virtual Account untuk pembayaran via bank',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nama akun/penerima VA' },
          bank_code: { type: 'string', description: 'Kode bank: BCA, BNI, BRI, MANDIRI, PERMATA, COMMON' }
        },
        required: ['name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'createPaymentLink',
      description: 'Membuat link pembayaran yang bisa dibagikan',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Jumlah pembayaran dalam Rupiah (0 jika flexible)' },
          description: { type: 'string', description: 'Deskripsi pembayaran' }
        },
        required: ['amount', 'description']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'createDisbursement',
      description: 'Transfer/kirim uang ke rekening bank',
      parameters: {
        type: 'object',
        properties: {
          amount: { type: 'number', description: 'Jumlah yang akan dikirim dalam Rupiah' },
          bank_code: { type: 'string', description: 'Kode bank: BCA, BNI, BRI, MANDIRI, PERMATA' },
          account_number: { type: 'string', description: 'Nomor rekening tujuan' },
          account_name: { type: 'string', description: 'Nama pemilik rekening' },
          description: { type: 'string', description: 'Deskripsi transfer' }
        },
        required: ['amount', 'bank_code', 'account_number', 'account_name']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generateReport',
      description: 'Generate laporan transaksi',
      parameters: {
        type: 'object',
        properties: {
          type: { type: 'string', description: 'Tipe laporan: TRANSACTION atau BALANCE' }
        },
        required: ['type']
      }
    }
  }
];

// ========== INTENT DETECTION ==========

function detectIntent(message) {
  const lower = message.toLowerCase();

  if (/saldo|balance|cek.*uang|berapa.*uang|total.*saldo/.test(lower)) {
    return 'balance';
  }
  if (/virtual.?account|va|rekening.*bank|buat.*rekening/.test(lower)) {
    return 'virtual_account';
  }
  if (/link.*bayar|payment.*link|link.*pembayaran|bagikan.*link/.test(lower)) {
    return 'payment_link';
  }
  if (/transfer|kirim.*uang|disbursement|bayar.*ke.*rekening|kirim.*ke.*bank/.test(lower)) {
    return 'disbursement';
  }
  if (/laporan|report|riwayat|transaksi.*terakhir|history/.test(lower)) {
    return 'report';
  }
  if (/beli|bayar|invoice|tagihan|pembayaran|transaksi|order|pesan/.test(lower)) {
    return 'invoice';
  }

  return 'chat';
}

// ========== TOOL EXECUTION ==========

async function executeTool(toolName, args) {
  switch (toolName) {
    case 'createXenditInvoice':
      return await handleCreateInvoice(args.amount, args.description);

    case 'checkBalance':
      return await handleCheckBalance();

    case 'createVirtualAccount':
      return await handleCreateVA(args.name, args.bank_code);

    case 'createPaymentLink':
      return await handleCreatePaymentLink(args.amount, args.description);

    case 'createDisbursement':
      return await handleDisbursement(args.amount, args.bank_code, args.account_number, args.account_name, args.description);

    case 'generateReport':
      return await handleReport(args.type);

    default:
      return { reply: 'Maaf, saya tidak mengenali perintah tersebut.' };
  }
}

// ========== HANDLERS ==========

async function handleCreateInvoice(amount, description) {
  if (!amount || amount <= 0) {
    return { reply: 'Maaf, nominal pembayaran harus di atas Rp0.' };
  }
  if (amount < 10000) {
    return { reply: `Maaf, nominal pembayaran harus di atas Rp10.000. Anda menyebutkan Rp${amount.toLocaleString('id-ID')}.` };
  }

  try {
    const order = await createOrder(description, amount);
    const invoice = await xendit.createInvoice(amount, description, order.order_id);
    await createTransaction(order.order_id, invoice.id || invoice.xendit_id, invoice.invoice_url);

    return {
      reply: `✅ Invoice dibuat!\n\n**${description}** — Rp${amount.toLocaleString('id-ID')}\n\nLink: ${invoice.invoice_url || invoice.hosted_invoice_url}`,
      action: 'invoice',
      invoice_url: invoice.invoice_url || invoice.hosted_invoice_url,
      amount,
      description,
      status: invoice.status || 'PENDING',
      order_id: order.order_id
    };
  } catch (error) {
    return { reply: `❌ Gagal membuat invoice: ${error.message}` };
  }
}

async function handleCheckBalance() {
  try {
    const balance = await xendit.getBalance();
    const formatted = balance.balance ? `Rp${balance.balance.toLocaleString('id-ID')}` : 'N/A';

    return {
      reply: `💰 **Saldo Akun Xendit:** ${formatted}\n\n${balance.mock ? '_(Mock data — Xendit sandbox)_' : ''}`,
      action: 'balance',
      balance: balance.balance,
      currency: balance.currency || 'IDR'
    };
  } catch (error) {
    return { reply: `❌ Gagal cek saldo: ${error.message}` };
  }
}

async function handleCreateVA(name, bankCode) {
  try {
    const va = await xendit.createVirtualAccount(name, bankCode);

    return {
      reply: `🏦 **Virtual Account dibuat!**\n\nBank: ${va.bank_code || bankCode}\nNama: ${name}\nNomor VA: ${va.virtual_account_number || va.id}\nStatus: ${va.status || 'ACTIVE'}`,
      action: 'virtual_account',
      va_id: va.id,
      bank_code: va.bank_code || bankCode,
      virtual_account_number: va.virtual_account_number,
      status: va.status || 'ACTIVE'
    };
  } catch (error) {
    return { reply: `❌ Gagal membuat Virtual Account: ${error.message}` };
  }
}

async function handleCreatePaymentLink(amount, description) {
  try {
    const link = await xendit.createPaymentLink(amount, description);

    return {
      reply: `🔗 **Payment Link dibuat!**\n\n${description} — Rp${amount.toLocaleString('id-ID')}\n\nLink: ${link.url || link.checkout_url}`,
      action: 'payment_link',
      payment_link_url: link.url || link.checkout_url,
      amount,
      description,
      status: link.status || 'ACTIVE'
    };
  } catch (error) {
    return { reply: `❌ Gagal membuat Payment Link: ${error.message}` };
  }
}

async function handleDisbursement(amount, bankCode, accountNumber, accountName, description) {
  if (!amount || amount <= 0) {
    return { reply: 'Maaf, jumlah transfer harus lebih dari Rp0.' };
  }

  try {
    const disb = await xendit.createDisbursement(amount, bankCode, accountNumber, accountName, description);

    return {
      reply: `💸 **Transfer berhasil dibuat!**\n\nTujuan: ${accountName} (${bankCode}) ${accountNumber}\nJumlah: Rp${amount.toLocaleString('id-ID')}\nStatus: ${disb.status || 'COMPLETED'}`,
      action: 'disbursement',
      disbursement_id: disb.id,
      amount,
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
      status: disb.status || 'COMPLETED'
    };
  } catch (error) {
    return { reply: `❌ Gagal transfer: ${error.message}` };
  }
}

async function handleReport(type) {
  try {
    const report = await xendit.generateReport(type);

    return {
      reply: `📊 **Laporan ${type || 'TRANSACTION'} dibuat!**\n\nStatus: ${report.status || 'COMPLETED'}\n${report.download_url ? `Download: ${report.download_url}` : ''}`,
      action: 'report',
      report_id: report.id,
      type: report.type || type,
      status: report.status || 'COMPLETED',
      download_url: report.download_url
    };
  } catch (error) {
    return { reply: `❌ Gagal generate laporan: ${error.message}` };
  }
}

// ========== MAIN HANDLER ==========

function extractAmountFromText(text) {
  const numbers = text.match(/\d+/g);
  if (!numbers) return null;
  return Math.max(...numbers.map(n => parseInt(n)));
}

function extractDescriptionFromText(text) {
  return text
    .replace(/(?:beli|buat|buatkan|tolong|saya ingin|mau|bayar|transfer|kirim)\s*/gi, '')
    .replace(/(?:rp|Rp|RP)?\s*[\d,.\s]+(?:rb|ribu)?/g, '')
    .replace(/\s+/g, ' ')
    .trim() || 'Pembayaran';
}

async function handleMessage(userMessage) {
  const intent = detectIntent(userMessage);
  const ai = getClient();

  // Try AI with tools first
  if (ai) {
    try {
      const response = await Promise.race([
        ai.chat.completions.create({
          model: AI_MODEL,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage }
          ],
          tools: TOOLS,
          tool_choice: 'auto',
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 15000))
      ]);

      const choice = response.choices[0];

      if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls) {
        const toolCall = choice.message.tool_calls[0];
        const args = JSON.parse(toolCall.function.arguments);
        return await executeTool(toolCall.function.name, args);
      }

      // No tool call — return AI text response
      return { reply: choice.message.content || 'Maaf, saya tidak dapat memproses permintaan Anda.' };
    } catch (error) {
      console.error('AI API error:', error.message);
    }
  }

  // Fallback to regex-based intent detection
  return await handleIntentFallback(intent, userMessage);
}

async function handleIntentFallback(intent, userMessage) {
  switch (intent) {
    case 'balance':
      return await handleCheckBalance();

    case 'virtual_account':
      return await handleCreateVA('Sandbox User', 'BCA');

    case 'payment_link':
      return await handleCreatePaymentLink(
        extractAmountFromText(userMessage) || 10000,
        extractDescriptionFromText(userMessage)
      );

    case 'disbursement':
      return {
        reply: 'Untuk transfer, mohon tentukan: bank, nomor rekening, nama pemilik, dan jumlah. Contoh: "Transfer BCA 1234567890 John Doe Rp500.000"'
      };

    case 'report':
      return await handleReport('TRANSACTION');

    case 'invoice':
      return await handleCreateInvoice(
        extractAmountFromText(userMessage) || 0,
        extractDescriptionFromText(userMessage)
      );

    default:
      return {
        reply: 'Saya bisa bantu dengan:\n• "Beli sepatu Rp150.000" — buat invoice\n• "Cek saldo" — lihat saldo\n• "Buat VA BCA" — Virtual Account\n• "Buat link bayar Rp100.000" — Payment Link\n• "Transfer BCA 1234567890 Budi Rp500.000"\n• "Lihat laporan" — generate report'
      };
  }
}

module.exports = { handleMessage };
