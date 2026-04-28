import { Link } from "react-router";
import "../styles/EventCard.css"

export default function EventCard({ event }) {
    return (
        <div className="card-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div className="title-container">
                    <h1>{event.title}</h1>
                </div>
                <div className="description-event-container">
                    <p>{event.description}</p>
                </div>
                <div className="information-event-container">
                    <div>📅 {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                    <div>⏰ {event.event_time || 'TBD'}</div>
                    <div>📍 {event.location}</div>
                </div>
            </div>
            <Link to={`/events/${event.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                RSVP
            </Link>
        </div>
    );
}