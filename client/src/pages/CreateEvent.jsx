import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { createEvent } from '../services/EventsAPI';
import "../styles/CreateEvent.css"

import { getAuthUser } from '../services/AuthAPI';

export default function CreateEvent() {
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const auth = await getAuthUser();
            if (!auth) navigate('/login');
        })();
    }, [navigate]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        event_time: '',
        location: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Hardcoding host_id to 1 for the MVP
            await createEvent({ ...formData, host_id: 1 });
            // Redirect back to the homepage after successful creation
            navigate('/');
        } catch (error) {
            alert("Failed to create event. Check console for details.");
        }
    };

    return (
        <main className="main-container">
            <h2 className="create-event-title">Host a New Potluck</h2>
            <form className="event-form" onSubmit={handleSubmit}>
                <input
                    type="text" name="title" placeholder="Event Title" required
                    value={formData.title} onChange={handleChange}
                />
                <textarea
                    name="description" placeholder="What are we celebrating?" required
                    value={formData.description} onChange={handleChange}
                />
                <input
                    type="date" name="event_date" required
                    value={formData.event_date} onChange={handleChange}
                />
                <input
                    type="time" name="event_time" required
                    value={formData.event_time} onChange={handleChange}
                />
                <input
                    type="text" name="location" placeholder="Location (e.g., Tom's House)" required
                    value={formData.location} onChange={handleChange}
                />
                <button type="submit" className="btn-primary">Create Event</button>
            </form>
        </main>
    );
}