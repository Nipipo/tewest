const express = require('express');
const axios = require('axios');
const path = require('path');
const morgan = require('morgan');

const app = express();
const port = 3000;

// Use morgan to log requests to the console
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/api/search', (req, res) => {
    res.send('This endpoint is for POST requests. Please use the web interface to search.');
});

app.post('/api/search', async (req, res) => {
  try {
    const { api_key, type, input, page } = req.body;

    // Ensure required fields are provided
    if (!api_key || !type || !input) {
      return res.status(400).json({ error: 'Missing required fields: api_key, type, and input' });
    }

    // Prepare the request body
    const requestBody = {
      api_key,
      type,
      input,
    };

    // Include the page field if provided
    if (page) {
      requestBody.page = page;
    }

    // Make the API request to BreachBase
    const response = await axios.post('https://breachbase.com/api/search', requestBody);
    res.json(response.data);
  } catch (error) {
    // Log the error details for debugging
    console.error('API request error:', error);

    // Handle errors and send appropriate response
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
