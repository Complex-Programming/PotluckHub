import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../styles/Events.css"
import { getAllEvents } from "../services/EventsAPI";
import { getAuthUser } from "../services/AuthAPI"
import { useNavigate } from "react-router";

export default function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getAllEvents();
            if (data) setEvents(data);
        };
        fetchEvents();
    }, []);

    const handleCreateEvent = async () => {
        const auth = await getAuthUser();
        if (auth) {
            navigate('/create-event');
        } else {
            navigate('/login');
        }
    }

    return (
        <>
            <div className="heading-container">
                <h1>Potluck Events</h1>
                <button
                    onClick={handleCreateEvent}
                    className="create-event-button"
                >
                    Create Event
                </button>
            </div>

            <div className="events-container">
                {events.length === 0 ? (
                    <p style={{ textAlign: 'center', marginTop: '2rem' }}>No events found. Be the first to host one!</p>
                ) : (
                    events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </>
    );
}