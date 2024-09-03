const express = require('express');
const cors = require('cors');
const pool = require('./database');
const { v4: uuidv4 } = require('uuid'); // Import UUID library for generating unique game IDs

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to create a new game
app.post('/new-game', async (req, res) => {
  const { gridSize, initialState } = req.body;
  const gameId = uuidv4();  // Generate a unique game ID

  try {
    const result = await pool.query(
      'INSERT INTO games (game_id, grid_size, initial_state, state) VALUES ($1, $2, $3, $4) RETURNING *',
      [gameId, gridSize, JSON.stringify(initialState), JSON.stringify(initialState)] // Save initial state as the current state initially
    );
    res.status(201).json(result.rows[0]);  // Send the new game record back to the client
  } catch (error) {
    console.error('Error creating new game:', error);
    res.status(500).send('Server Error');
  }
});

// API endpoint to save game state
app.post('/save', async (req, res) => {
  const { gameId, state } = req.body;

  try {
    const result = await pool.query(
      'UPDATE games SET state = $1 WHERE game_id = $2 RETURNING *',
      [JSON.stringify(state), gameId]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving game state:', error);
    res.status(500).send('Server Error');
  }
});

// API endpoint to load the latest game state
app.get('/load', async (req, res) => {
  const { gameId } = req.query;

  try {
    const result = await pool.query(
      'SELECT state FROM games WHERE game_id = $1',
      [gameId]
    );

    if (result.rows.length > 0) {
      const state = result.rows[0].state;
      try {
        const parsedState = JSON.parse(state);
        res.status(200).json(parsedState);
      } catch (jsonError) {
        console.error('Error parsing JSON:', jsonError);
        res.status(500).send('Invalid JSON data.');
      }
    } else {
      res.status(404).send('Game not found.');
    }
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
