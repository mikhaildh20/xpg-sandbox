# Functional Specification Document (FSD)

## 1. Alur Kerja Sistem (Workflow)
1. User masuk ke web dan membuka ruang obrolan dengan AI Agent.
2. User memberikan instruksi teks (misal: "Beli token game Rp 50.000").
3. AI memproses teks, melakukan konfirmasi, lalu membuat *Xendit Invoice Link*.
4. Sistem menampilkan link/pop-up pembayaran kepada User.
5. User melakukan simulasi bayar melalui tombol "Simulate Success".
6. Server menerima webhook, status diperbarui, AI mengucapkan "Terima kasih, pembayaran lunas!".

## 2. Aturan Validasi & Logika Bisnis
* **Minimal Transaksi:** Rp 10.000 (mengikuti aturan minimum Xendit).
* **Mata Uang:** IDR (Rupiah).
* **AI Constraint:** AI hanya boleh melayani perintah seputar pembuatan tagihan, cek saldo sandbox, dan status transaksi. Di luar itu, AI menolak halus.