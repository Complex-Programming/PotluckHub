import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getEventById } from '../services/EventsAPI';

export default function EventDetail() {
    const { id } = useParams(); 
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the specific event data based on the URL ID
    useEffect(() => {
        const fetchEvent = async () => {
            const data = await getEventById(id);
            setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    // Handle loading and error states
    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Loading event details...</h2>;
    if (!event) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Event not found!</h2>;

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Back to Homepage
            </Link>
            
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                {/* Event Header */}
                <h1 style={{ marginTop: 0, fontSize: '2.5rem', color: '#222' }}>{event.title}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.6' }}>{event.description}</p>
                
                {/* Event Metadata Grid */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '1rem', 
                    margin: '2rem 0', 
                    padding: '1.5rem', 
                    background: '#f8f9fa', 
                    borderRadius: '8px',
                    border: '1px solid #eee'
                }}>
                    <div><strong>📅 Date:</strong> {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                    <div><strong>⏰ Time:</strong> {event.event_time || 'TBD'}</div>
                    <div><strong>📍 Location:</strong> {event.location}</div>
                    <div><strong>👑 Host ID:</strong> {event.host_id}</div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '2.5rem 0' }} />

                {/* --- FUTURE PHASE PLACEHOLDERS --- */}
                
                {/* Feature 3: RSVPs */}
                <section style={{ marginBottom: '3rem' }}>
                    <h2>Guest List</h2>
                    <p style={{ color: '#666' }}><em>RSVP feature coming in Phase 4...</em></p>
                    <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        RSVP to Event
                    </button>
                </section>

                {/* Feature 4: Dish Claiming */}
                <section>
                    <h2>Potluck Menu</h2>
                    <p style={{ color: '#666' }}><em>Dish claiming feature coming in Phase 5...</em></p>
                    <button className="btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        Bring a Dish
                    </button>
                </section>
            </div>
        </main>
    );
}