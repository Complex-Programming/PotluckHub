const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserProfile = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/api/users/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};

export const updateUserBio = async (id, bio) => {
    try {
        const response = await fetch(`${BASE_URL}/api/users/${id}/bio`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ bio }),
        });
        if (!response.ok) throw new Error('Failed to update user bio');
        return await response.json();
    } catch (error) {
        console.error('Error updating user bio:', error);
        return null;
    }
};
