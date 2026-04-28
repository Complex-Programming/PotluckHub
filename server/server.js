import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import eventsRouter from './routes/events.js';
import recipesRouter from './routes/recipes.js';
import usersRouter from './routes/users.js';
import rsvpsRouter from './routes/rsvps.js';
import registerRouter from './routes/register.js';
import authRouter from './routes/auth.js';
import session from 'express-session';
import passport from 'passport';
import { GitHub } from './config/auth.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 8080;

if (!process.env.PORT) {
    console.warn('PORT is not set. Defaulting to 8080.');
} else {
    console.log(`Using PORT ${PORT}., should be 8080`);
}

if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());

// session + passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// configure passport strategy
passport.use(GitHub);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));


app.get('/', (req, res) => {
    res.send('Server is running!');
});
//routes
app.use('/api/events', eventsRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/rsvps', rsvpsRouter);
// auth routes (GitHub)
app.use('/api/auth', authRouter);
// keep register endpoint separate
app.use('/api/register', registerRouter);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.status(200).send('PotluckHub API is running on GCP!');
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})