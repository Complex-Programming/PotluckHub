const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthUser = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/login/success`, {
            credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.user || null;
    } catch (err) {
        console.error('Auth check failed', err);
        return null;
    }
};

export const logout = async () => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/logout`, {
            credentials: 'include',
        });
        return res.ok;
    } catch (err) {
        console.error('Logout failed', err);
        return false;
    }
};
