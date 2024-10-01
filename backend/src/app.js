// backend/src/app.js
const express = require('express');
const cors = require('cors');
const emailRoutes = require('./routes/emailRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

app.use('/api', emailRoutes); // Mount the email routes under /api

app.listen(3000, () => console.log('Server running on port 3000'));
