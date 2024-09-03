const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to save game state
app.post('/save', async (req, res) => {
  const { state } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO game_states (state) VALUES ($1) RETURNING *',
      [state]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving game state:', error);
    res.status(500).send('Server Error');
  }
});

// API endpoint to load the latest game state
app.get('/load', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT state FROM game_states ORDER BY created_at DESC LIMIT 1'
    );
    res.status(200).json(result.rows[0] ? result.rows[0].state : null);
  } catch (error) {
    console.error('Error loading game state:', error);
    res.status(500).send('Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
