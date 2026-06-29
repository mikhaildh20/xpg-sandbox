### 5. `ERD.md` (Entity Relationship Diagram)
```markdown
# Entity Relationship Diagram (ERD)

Karena ini proyek *simple*, kita hanya membutuhkan dua entitas utama untuk melacak transaksi di memory database/local state.

┌──────────────────┐             ┌──────────────────┐
│     ORDERS       │             │   TRANSACTIONS   │
├──────────────────┤             ├──────────────────┤
│ PK | order_id    │1 ────────── 1│ PK | tx_id       │
│    | item_name   │             │ FK | order_id     │
│    | amount      │             │    | xendit_id    │
│    | status      │             │    | invoice_url  │
│    | created_at  │             │    | payment_meth │
└──────────────────┘             └──────────────────┘

