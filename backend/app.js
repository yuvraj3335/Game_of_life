const express = require('express');
const cors = require('cors');
const pool = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to save game state with additional metadata
app.post('/save', async (req, res) => {
  console.log(req.body); // Log the request body to debug
  const { state, initialConfig, startTime, endTime } = req.body;

  // Ensure state is a JSON string
  const stateString = JSON.stringify(state);

  try {
    const result = await pool.query(
      `INSERT INTO game_states (state, initial_config, creation_time, end_time)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [stateString, JSON.stringify(initialConfig), startTime, endTime]
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
      'SELECT state, initial_config, creation_time, end_time FROM game_states ORDER BY creation_time DESC LIMIT 1'
    );
    res.status(200).json(result.rows[0] ? {
      state: JSON.parse(result.rows[0].state),
      initialConfig: JSON.parse(result.rows[0].initial_config),
      creationTime: result.rows[0].creation_time,
      endTime: result.rows[0].end_time
    } : null);
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
