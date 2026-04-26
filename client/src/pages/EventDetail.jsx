import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getEventById, getEventAttendees, submitRSVP, cancelRSVP } from '../services/EventsAPI';
import '../styles/EventDetail.css';

export default function EventDetail({ currentUser }) {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rsvpError, setRsvpError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const [eventData, attendeeData] = await Promise.all([
                getEventById(id),
                getEventAttendees(id)
            ]);
            setEvent(eventData);
            setAttendees(attendeeData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const isAttending = attendees.some(person => person.id === currentUser.id);

    const handleRsvpToggle = async () => {
        setRsvpError('');
        if (isAttending) {
            setAttendees(prev => prev.filter(person => person.id !== currentUser.id));
            try {
                await cancelRSVP(id, currentUser.id);
            } catch {
                setAttendees(prev => [...prev, currentUser]);
                setRsvpError('Could not update RSVP. Please try again.');
            }
        } else {
            setAttendees(prev => [...prev, currentUser]);
            try {
                await submitRSVP(id, currentUser.id);
            } catch {
                setAttendees(prev => prev.filter(person => person.id !== currentUser.id));
                setRsvpError('Could not update RSVP. Please try again.');
            }
        }
    };

    if (loading) return <h2 className="event-detail-status">Loading event details...</h2>;
    if (!event) return <h2 className="event-detail-status">Event not found!</h2>;

    return (
        <main className="event-detail-page">
            <Link to="/" className="event-detail-back-link">
                ← Back to Homepage
            </Link>

            <div className="event-detail-card">
                <h1 className="event-detail-title">{event.title}</h1>
                <p className="event-detail-description">{event.description}</p>

                <div className="event-detail-meta-grid">
                    <div><strong>📅 Date:</strong> {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                    <div><strong>⏰ Time:</strong> {event.event_time || 'TBD'}</div>
                    <div><strong>📍 Location:</strong> {event.location}</div>
                    <div><strong>👑 Host ID:</strong> {event.host_id}</div>
                </div>

                <hr className="event-detail-divider" />

                <section className="event-detail-section">
                    <h2>Guest List ({attendees.length})</h2>
                    {attendees.length === 0 ? (
                        <p className="event-detail-muted">No one has RSVP'd yet. Be the first!</p>
                    ) : (
                        <ul className="event-detail-attendee-list">
                            {attendees.map(person => (
                                <li key={person.id}>
                                    👤 {person.name} {person.id === currentUser.id && <span className="event-detail-you-label">(You)</span>}
                                </li>
                            ))}
                        </ul>
                    )}

                    <button
                        className={isAttending ? 'btn-secondary' : 'btn-primary'}
                        onClick={handleRsvpToggle}
                        id="event-detail-rsvp-button"
                    >
                        {isAttending ? 'Cancel RSVP' : "I'm Going!"}
                    </button>
                    {rsvpError && <p className="event-detail-error">{rsvpError}</p>}
                </section>

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
