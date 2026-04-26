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
// GET all attendees for a specific event
export const getEventAttendees = async (req, res) => {
    try {
        const eventId = req.params.id;
        // A SQL JOIN to get the names of users attending this event
        const query = `
            SELECT "user".id, "user".name 
            FROM "user"
            JOIN user_to_event ON "user".id = user_to_event.user_id
            WHERE user_to_event.event_id = $1
        `;
        const results = await pool.query(query, [eventId]);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ error: 'Failed to fetch attendees' });
    }
};

// POST an RSVP (User joins an event)
export const createRSVP = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { user_id } = req.body; // Sent from the frontend Fake Auth
        
        await pool.query(
            'INSERT INTO user_to_event (user_id, event_id) VALUES ($1, $2)', 
            [user_id, eventId]
        );
        res.status(201).json({ message: 'RSVP successful' });
    } catch (error) {
        console.error('Error creating RSVP:', error);
        res.status(500).json({ error: 'Failed to RSVP' });
    }
};

// DELETE an RSVP (User leaves an event)
export const deleteRSVP = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { user_id } = req.body; 
        
        await pool.query(
            'DELETE FROM user_to_event WHERE user_id = $1 AND event_id = $2', 
            [user_id, eventId]
        );
        res.status(200).json({ message: 'RSVP cancelled' });
    } catch (error) {
        console.error('Error deleting RSVP:', error);
        res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
};