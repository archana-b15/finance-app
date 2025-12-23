import React, { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState('');
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) { console.error("Error fetching data"); }
  };

  async function handleAction(type) {
    const endpoint = type === 'login' ? 'login' : 'register';
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === 'ok' && type === 'login') {
        setIsLoggedIn(true);
        setUserId(data.userId);
        fetchHistory(data.userId);
      } else if (data.status === 'ok' && type === 'register') {
        alert("Account Created! Now click Login.");
      } else { alert("Failed. Try again."); }
    } catch (err) { alert("Backend is not running! Check your terminal."); }
  }

  async function addTransaction(e) {
    e.preventDefault();
    await fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, amount: Number(amount), userId }),
    });
    setText(''); setAmount('');
    fetchHistory(userId);
  }

  async function deleteTransaction(id) {
    await fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' });
    fetchHistory(userId);
  }

  const totalBalance = history.reduce((acc, item) => acc + item.amount, 0).toFixed(2);

  if (isLoggedIn) return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '500px', margin: 'auto' }}>
      <h1>Wallet Watch 💰</h1>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#7f8c8d', margin: 0 }}>Total Balance</p>
        <h2 style={{ fontSize: '32px', color: totalBalance >= 0 ? '#27ae60' : '#e74c3c' }}>₹{totalBalance}</h2>
      </div>
      <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input style={{ padding: '10px' }} placeholder="Description" value={text} onChange={e => setText(e.target.value)} />
        <input style={{ padding: '10px' }} placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <button style={{ padding: '10px', background: '#3498db', color: '#fff', border: 'none', borderRadius: '5px' }}>Add</button>
      </form>
      {history.map((h) => (
        <div key={h._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fff', marginBottom: '5px', borderRadius: '8px', borderLeft: `5px solid ${h.amount >= 0 ? '#27ae60' : '#e74c3c'}` }}>
          <span>{h.text} (${h.amount})</span>
          <button onClick={() => deleteTransaction(h._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f2f5', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '300px', textAlign: 'center' }}>
        <h2>Wallet Watch 🔒</h2>
        <input style={{ width: '100%', padding: '10px', marginBottom: '10px' }} placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input style={{ width: '100%', padding: '10px', marginBottom: '20px' }} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={() => handleAction('register')} style={{ marginRight: '10px' }}>Sign Up</button>
        <button onClick={() => handleAction('login')} style={{ background: '#3498db', color: '#fff' }}>Login</button>
      </div>
    </div>
  );
}