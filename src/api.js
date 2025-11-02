import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const db = new sqlite3.Database("src/holders.db", sqlite3.OPEN_READWRITE);

app.use(cors());
app.use(express.json());

app.get('/api/holders/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM holders WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row || {});
  });
});

app.listen(3000, () => console.log("✅ Backend running on http://localhost:3000"));