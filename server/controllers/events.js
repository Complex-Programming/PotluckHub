import pool from '../config/database.js';

// GET all events
export const getAllEvents = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM event ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching all events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// GET a single event by ID
export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const results = await pool.query('SELECT * FROM event WHERE id = $1', [eventId]);
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json(results.rows[0]);
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
};

// POST a new event
export const createEvent = async (req, res) => {
    try {
        const { host_id, title, description, event_date, event_time, location } = req.body;
        
        // Use RETURNING * to immediately send back the newly created event data to the frontend
        const insertQuery = `
            INSERT INTO event (host_id, title, description, event_date, event_time, location) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        
        const results = await pool.query(insertQuery, [
            host_id, 
            title, 
            description, 
            event_date, 
            event_time, 
            location
        ]);
        
        res.status(201).json(results.rows[0]);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
};