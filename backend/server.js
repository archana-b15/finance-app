const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://admin:Archana12345@cluster0.lqibxku.mongodb.net/myFinanceApp?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI).then(() => console.log("Connected to MongoDB! 🏦"));

// MODELS
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}));

const Transaction = mongoose.model('Transaction', new mongoose.Schema({
  userId: String,
  text: String,
  amount: Number,
  date: { type: Date, default: Date.now }
}));

// ROUTES
app.post('/api/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await User.create({ email: req.body.email, password: hashedPassword });
  res.json({ status: 'ok' });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && await bcrypt.compare(req.body.password, user.password)) {
    const token = jwt.sign({ id: user._id }, 'secret123');
    return res.json({ status: 'ok', user: token, userId: user._id }); // We send userId back!
  }
  res.json({ status: 'error' });
});

app.post('/api/transactions', async (req, res) => {
  await Transaction.create(req.body);
  res.json({ status: 'ok' });
});

app.get('/api/transactions/:userId', async (req, res) => {
  const data = await Transaction.find({ userId: req.params.userId });
  res.json(data);
});

app.listen(5000, () => console.log('Server running on port 5000'));
// Add this below your other transaction routes
app.delete('/api/transactions/:id', async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ status: 'ok' });
});