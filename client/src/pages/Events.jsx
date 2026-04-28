import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../styles/Events.css"
import { Link } from "react-router";
import { getAllEvents } from "../services/EventsAPI";

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getAllEvents();
            if (data) setEvents(data);
        };
        fetchEvents();
    }, []);

    return (
        <>
            <div className="heading-container">
                <h1>Potluck Events</h1>
                <Link to="/create-event">Create Event</Link>
            </div>

            <div className="events-container">
                {events.length === 0 ? (
                    <p style={{ textAlign: ‘center’, marginTop: ‘2rem’ }}>No events found. Be the first to host one!</p>
                ) : (
                    events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </div>
        </>
    );
}