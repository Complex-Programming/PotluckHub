import pool from '../config/database.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        const userResult = await pool.query(
            'SELECT id, name, bio, email FROM "user" WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hostedEventsResult = await pool.query(
            `SELECT id, title, event_date, event_time, location
       FROM event
       WHERE host_id = $1
       ORDER BY event_date ASC, event_time ASC`,
            [userId]
        );

        const attendingEventsResult = await pool.query(
            `SELECT e.id, e.title, e.event_date, e.event_time, e.location
       FROM user_to_event ute
       JOIN event e ON e.id = ute.event_id
       WHERE ute.user_id = $1
       ORDER BY e.event_date ASC, e.event_time ASC`,
            [userId]
        );

        res.status(200).json({
            ...userResult.rows[0],
            hosted_events: hostedEventsResult.rows,
            attending_events: attendingEventsResult.rows
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const results = await pool.query('SELECT id, name FROM "user" ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};