const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAttendeesByEventId = async (eventId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/rsvps/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch attendees');
        return await response.json();
    } catch (error) {
        console.error('Error fetching attendees:', error);
        return [];
    }
};

export const createRsvp = async (userId, eventId) => {
    const response = await fetch(`${BASE_URL}/api/rsvps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_id: Number(eventId) })
    });

    if (!response.ok) {
        throw new Error('Failed to RSVP');
    }

    return response.json();
};

export const deleteRsvp = async (userId, eventId) => {
    const response = await fetch(`${BASE_URL}/api/rsvps`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_id: Number(eventId) })
    });

    if (!response.ok) {
        throw new Error('Failed to remove RSVP');
    }

    return response.json();
};
