import pool from '../config/database.js';

export const getAttendeesByEventId = async (req, res) => {
    try {
        const eventId = Number(req.params.eventId);

        if (!Number.isInteger(eventId) || eventId <= 0) {
            return res.status(400).json({ error: 'Invalid event id' });
        }

        const result = await pool.query(
            `SELECT u.id, u.name, u.email
       FROM user_to_event ute
       JOIN "user" u ON u.id = ute.user_id
       WHERE ute.event_id = $1
       ORDER BY u.name ASC`,
            [eventId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ error: 'Failed to fetch attendees' });
    }
};

export const createRsvp = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        if (!user_id || !event_id) {
            return res.status(400).json({ error: 'user_id and event_id are required' });
        }

        const insertResult = await pool.query(
            `INSERT INTO user_to_event (user_id, event_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, event_id) DO NOTHING
       RETURNING *`,
            [user_id, event_id]
        );

        if (insertResult.rows.length === 0) {
            return res.status(200).json({ message: 'RSVP already exists' });
        }

        res.status(201).json(insertResult.rows[0]);
    } catch (error) {
        console.error('Error creating RSVP:', error);
        res.status(500).json({ error: 'Failed to create RSVP' });
    }
};

export const deleteRsvp = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        if (!user_id || !event_id) {
            return res.status(400).json({ error: 'user_id and event_id are required' });
        }

        const deleteResult = await pool.query(
            `DELETE FROM user_to_event
       WHERE user_id = $1 AND event_id = $2
       RETURNING *`,
            [user_id, event_id]
        );

        if (deleteResult.rows.length === 0) {
            return res.status(404).json({ error: 'RSVP not found' });
        }

        res.status(200).json({ message: 'RSVP removed' });
    } catch (error) {
        console.error('Error deleting RSVP:', error);
        res.status(500).json({ error: 'Failed to delete RSVP' });
    }
};
