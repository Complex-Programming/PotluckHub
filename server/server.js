import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import recipesRouter from './routes/recipes.js';
import usersRouter from './routes/users.js';
import rsvpsRouter from './routes/rsvps.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.use('/api/events', eventsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/rsvps', rsvpsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
})