// backend/src/app.js
import express, { json } from 'express';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes';

const app = express();
app.use(cors());
app.use(json()); // Parse JSON request bodies

app.use('/api', emailRoutes); // Mount the email routes under /api

app.listen(3000, () => console.log('Server running on port 3000'));
