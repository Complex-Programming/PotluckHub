// Fallback to localhost if the env variable isn't set yet
const BASE_URL = import.meta.env.VITE_API_BASE_URL
console.log(BASE_URL)
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
export const getEventAttendees = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/events/${id}/attendees`);
        if (!response.ok) throw new Error('Failed to fetch attendees');
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const submitRSVP = async (eventId, userId) => {
    await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
    });
};

export const cancelRSVP = async (eventId, userId) => {
    await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
    });
};
export const getAllUsers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/users`);
        return await response.json();
    } catch (error) {
        return [];
    }
};


export const getEventDishes = async (eventId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/events/${eventId}/dishes`);
        if (!response.ok) throw new Error('Failed to fetch dishes');
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const claimDish = async (eventId, recipeId, userId) => {
    const response = await fetch(`${BASE_URL}/api/events/${eventId}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe_id: recipeId, user_id: userId })
    });
    if (!response.ok) throw new Error('Failed to claim dish');
    return await response.json();
};

export const getAllRecipes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/recipes`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        return await response.json();
    } catch (error) {
        return [];
    }
};