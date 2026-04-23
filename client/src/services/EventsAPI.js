// Fallback to localhost if the env variable isn't set yet
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const getAllEvents = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        return await response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const createEvent = async (eventData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Failed to create event');
        return await response.json();
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
};

// Add this below your getAllEvents and createEvent functions
export const getEventById = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/events/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        return await response.json();
    } catch (error) {
        console.error("Error fetching event details:", error);
        return null;
    }
};