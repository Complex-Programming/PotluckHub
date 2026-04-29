import { Link, useNavigate } from "react-router";
import "../styles/EventCard.css"

export default function EventCard({ event }) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/events/${event.id}`);
    };

    const handleCardKeyDown = (eventKey) => {
        if (eventKey.key === 'Enter' || eventKey.key === ' ') {
            eventKey.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className="card-container"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            role="button"
            tabIndex={0}
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
        >
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
            <Link
                to={`/events/${event.id}`}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                onClick={(eventClick) => eventClick.stopPropagation()}
            >
                RSVP
            </Link>
        </div>
    );
}