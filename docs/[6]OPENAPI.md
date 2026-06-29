# OpenAPI Specification (Kontrak API)

```yaml
openapi: 3.0.0
info:
  title: AI Sandbox Payment API
  version: 1.0.0
paths:
  /api/chat:
    post:
      summary: Mengirimkan pesan teks ke AI Agent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
      responses:
        '200':
          description: Respon dari AI atau trigger pembuatan invoice.
          
  /api/webhook/xendit:
    post:
      summary: Endpoint untuk menerima laporan pembayaran sukses dari Xendit
      responses:
        '200':
          description: Webhook berhasil diproses.