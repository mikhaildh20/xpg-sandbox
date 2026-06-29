# Product Requirements Document (PRD) - AI-Powered Payment Assistant

## 1. Tujuan & Masalah
* **Masalah:** Pengguna pemula sering kali bingung dengan alur pembayaran manual (pilih bank, copy VA, cek status). Di sisi lain, developer butuh simulasi pembayaran yang interaktif tanpa ribet.
* **Solusi:** Aplikasi web sandbox pembayaran yang dilengkapi dengan Agentic AI (Chatbot pintar). AI berfungsi memandu user, membuatkan invoice otomatis berdasarkan perintah teks, dan membantu mensimulasikan status sukses/gagal.

## 2. Target Pengguna
* Developer atau mahasiswa yang ingin mempelajari integrasi Payment Gateway (Xendit Sandbox).
* Pengguna umum yang ingin merasakan pengalaman bertransaksi dipandu AI.

## 3. Fitur Utama (Scope)
* **AI Chat Interface:** User bisa mengetik *"Tolong buatkan tagihan beli sepatu Rp 150.000"*.
* **Xendit Sandbox Integration:** AI akan otomatis menembak API dan memunculkan link Xendit Invoice.
* **Transaction Simulator:** Tombol cepat untuk memicu simulasi pembayaran sukses di lingkungan Sandbox.

## 4. Kriteria Keberhasilan (Success Metrics)
* AI berhasil mengekstrak nominal uang dan item dari ketikan user dengan akurasi 100%.
* Link pembayaran Xendit terbuat secara otomatis dalam waktu < 3 detik.