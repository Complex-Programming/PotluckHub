import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import eventRoutes from './routes/events.js';
import recipeRoutes from './routes/recipes.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('PotluckHub API is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});