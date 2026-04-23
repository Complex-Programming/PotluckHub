import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getEventById } from '../services/EventsAPI';
import { createRsvp, deleteRsvp, getAttendeesByEventId } from '../services/RSVPsAPI';
import '../styles/EventDetail.css';

export default function EventDetail() {
    const { id } = useParams();
    const currentUserId = 1;
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rsvpLoading, setRsvpLoading] = useState(false);
    const [rsvpError, setRsvpError] = useState('');

    // Fetch the specific event data based on the URL ID
    useEffect(() => {
        const fetchEvent = async () => {
            const [eventData, attendeesData] = await Promise.all([
                getEventById(id),
                getAttendeesByEventId(id)
            ]);

            setEvent(eventData);
            setAttendees(attendeesData);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    const isRsvped = attendees.some((attendee) => attendee.id === currentUserId);

    const handleRsvpToggle = async () => {
        setRsvpLoading(true);
        setRsvpError('');

        try {
            if (isRsvped) {
                await deleteRsvp(currentUserId, id);
            } else {
                await createRsvp(currentUserId, id);
            }

            const attendeesData = await getAttendeesByEventId(id);
            setAttendees(attendeesData);
        } catch {
            setRsvpError('Could not update RSVP. Please try again.');
        } finally {
            setRsvpLoading(false);
        }
    };

    // Handle loading and error states
    if (loading) return <h2 className="event-detail-status">Loading event details...</h2>;
    if (!event) return <h2 className="event-detail-status">Event not found!</h2>;

    return (
        <main className="event-detail-page">
            <Link to="/" className="event-detail-back-link">
                ← Back to Homepage
            </Link>

            <div className="event-detail-card">
                {/* Event Header */}
                <h1 className="event-detail-title">{event.title}</h1>
                <p className="event-detail-description">{event.description}</p>

                {/* Event Metadata Grid */}
                <div className="event-detail-meta-grid">
                    <div><strong>📅 Date:</strong> {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                    <div><strong>⏰ Time:</strong> {event.event_time || 'TBD'}</div>
                    <div><strong>📍 Location:</strong> {event.location}</div>
                    <div><strong>👑 Host ID:</strong> {event.host_id}</div>
                </div>

                <hr className="event-detail-divider" />

                {/* --- FUTURE PHASE PLACEHOLDERS --- */}

                {/* Feature 3: RSVPs */}
                <section className="event-detail-section">
                    <h2>Guest List</h2>
                    {attendees.length === 0 ? (
                        <p className="event-detail-muted">No attendees yet.</p>
                    ) : (
                        <ul className="event-detail-attendee-list">
                            {attendees.map((attendee) => (
                                <li key={attendee.id}>
                                    {attendee.name}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleRsvpToggle}
                        disabled={rsvpLoading}
                        id="event-detail-rsvp-button"
                    >
                        {rsvpLoading ? 'Updating...' : isRsvped ? 'Cancel RSVP' : 'RSVP to Event'}
                    </button>
                    {rsvpError && <p className="event-detail-error">{rsvpError}</p>}
                </section>

                {/* Feature 4: Dish Claiming */}
                <section>
                    <h2>Potluck Menu</h2>
                    <p className="event-detail-muted"><em>Dish claiming feature coming in Phase 5...</em></p>
                    <button className="btn-primary event-detail-disabled-button" disabled>
                        Bring a Dish
                    </button>
                </section>
            </div>
        </main>
    );
}