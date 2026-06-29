### 7. `WIREFRAME.md`
```markdown
# Wireframe Antarmuka

Tampilan web berfokus pada gaya *Split-Screen* (Layar Terbagi):
* **Sisi Kiri:** Ruang Chat dengan AI Agent.
* **Sisi Kanan:** Simulator & Tampilan Iframe Invoice yang muncul.

┌────────────────────────────────────────────────────────┐
│  AI Payment Assistant (Sandbox Mode)                  │
├───────────────────────────┬────────────────────────────┤
│                           │                            │
│  [ AI Chat Room ]         │  [ Live Invoice View ]     │
│                           │                            │
│  User: Beli kopi Rp15rb   │  Menampilkan halaman       │
│  AI: Siap, ini linknya    │  Xendit Invoice asli       │
│                           │  secara realtime...        │
│                           │                            │
│                           │  ┌──────────────────────┐  │
│                           │  │ [ Simulate Success ] │  │
│  [ Ketik pesan... ] [Btn] │  └──────────────────────┘  │
└───────────────────────────┴────────────────────────────┘