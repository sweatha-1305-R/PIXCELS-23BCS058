const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Load movies data on startup
const moviesPath = path.join(__dirname, 'movies_metadata.json');
let movies = [];
try {
  const data=fs.readFileSync(moviesPath,'utf-8');
  movies = JSON.parse(data);
} catch (error) {
  console.error('Error loading movies metadata:', e);
}

// Helper: sanitize movie object for list view
function getMovieListItem(movie) {
  return {
    id: movie.id,
    title: movie.title,
    tagline: movie.tagline || '',
    vote_average: movie.vote_average || 0
  };
}

// API: List all movies
app.get('/api/movies/:id', (req, res) => {
  // Return list with minimal info for listing
  const id =req.params.id
  const list = movies.map(getMovieListItem);
  res.json(list);
});

// API: Get movie by ID
app.get('/api/movies/:id', (req, res) => {
  const id = req.params.id;
  const movie = movies.find(m => String(m.id) === id);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
