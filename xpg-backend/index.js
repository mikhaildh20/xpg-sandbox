require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:3001').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, true);
  }
}));
app.use(express.json());

// Core routes
app.use('/api/health', require('./routes/health'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/webhook/xendit', require('./routes/webhook'));
app.use('/api/simulate', require('./routes/simulate'));

// MONEY_IN routes
app.use('/api/balance', require('./routes/balance'));
app.use('/api/virtual-account', require('./routes/virtual-account'));
app.use('/api/payment-link', require('./routes/payment-link'));
app.use('/api/disbursement', require('./routes/disbursement'));
app.use('/api/report', require('./routes/report'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`XPG Backend running on port ${PORT}`);
});
