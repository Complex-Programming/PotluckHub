import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.js';
import recipesRouter from './routes/recipes.js';
import usersRouter from './routes/users.js';
import rsvpsRouter from './routes/rsvps.js';
import registerRouter from './routes/register.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

if (!process.env.PORT) {
    console.warn('PORT is not set. Defaulting to 8080.');
} else {
    console.log(`Using PORT ${PORT}.`);
}

if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

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
app.use('/api/auth', registerRouter);

app.listen(PORT, () => {
    console.log(`Server is running on PORT http://localhost:${PORT}`);
})