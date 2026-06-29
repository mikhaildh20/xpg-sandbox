# Technical Requirements Document (TRD)

## 1. Alur Teknis Agentic AI (Function Calling)
Ketika user mengetik perintah, LLM akan diarahkan untuk memicu fungsi `createXenditInvoice()`.

```javascript
// Contoh skema tools yang dibaca AI Agent
const tools = {
  createXenditInvoice: {
    description: 'Membuat link pembayaran resmi menggunakan Xendit',
    parameters: {
      amount: 'number (contoh: 150000)',
      description: 'string (contoh: Pembayaran Sepatu)'
    }
  }
}

## 2. Keamanan & Environment Variables
Semua API Key bersifat rahasia dan tidak boleh bocor ke frontend.

XENDIT_SECRET_KEY=xnd_development_...

OPENAI_API_KEY=sk-proj-...