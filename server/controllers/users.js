import pool from '../config/database.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        const userResult = await pool.query(
            'SELECT id, username, bio, avatarurl FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hostedEventsResult = await pool.query(
            `SELECT id, title, description, event_date, event_time, location
          FROM events
       WHERE host_id = $1
       ORDER BY event_date ASC, event_time ASC`,
            [userId]
        );

        const attendingEventsResult = await pool.query(
            `SELECT e.id, e.title, e.description, e.event_date, e.event_time, e.location
          FROM user_to_event ute
          JOIN events e ON e.id = ute.event_id
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

export const updateUserBio = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = Number(req.params.id);
        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        if (Number(req.user.id) !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const { bio } = req.body;
        if (typeof bio !== 'string') {
            return res.status(400).json({ error: 'Bio must be a string' });
        }

        const updated = await pool.query(
            'UPDATE users SET bio = $1 WHERE id = $2 RETURNING id, username, bio, avatarurl',
            [bio.trim(), userId]
        );

        if (updated.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updated.rows[0]);
    } catch (error) {
        console.error('Error updating user bio:', error);
        res.status(500).json({ error: 'Failed to update user bio' });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        const results = await pool.query('SELECT id, username FROM users ORDER BY id ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};