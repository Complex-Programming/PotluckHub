import { useState, useEffect } from "react";
import "../styles/Homepage.css";
import { Link } from 'react-router';
import { CalendarDays, ChefHat, Users } from 'lucide-react';
import { getAllEvents } from '../services/EventsAPI';

export default function Homepage() {
    // 1. Set up state to hold the events from the database
    const [events, setEvents] = useState([]);

    // 2. Fetch the events when the page loads
    useEffect(() => {
        const fetchEvents = async () => {
            const data = await getAllEvents();
            if (data) {
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="homepage-container">
            <header className="homepage-header-nav">
                <Link to="/events" className="header-nav-button">Events</Link>
                <Link to="/recipes" className="header-nav-button">Recipes</Link>
                <Link to="/profile" className="header-nav-button">Profile</Link>
            </header>

            {/* HERO */}
            <div className="hero-container">
                <h1>Plan perfect potlucks, <br /> every time</h1>
                <p>Coordinate dishes, track RSVPs, and share recipes with your community. No more duplicate dishes or forgotten plates.</p>
                <Link to="/create-event" className="btn-primary">Host an Event</Link>
            </div>

            {/* FEATURE CARDS */}
            <section className="features-container">
                <div className="feature-card">
                    <div className="card-icon">
                        <CalendarDays size={18} color="var(--primary)" />
                    </div>
                    <h3>Create Events</h3>
                    <p>Set up potluck gatherings with date, time, and location. Invite guests and track RSVPs effortlessly.</p>
                </div>
                <div className="feature-card">
                    <div className="card-icon">
                        <ChefHat size={18} color="var(--primary)" />
                    </div>
                    <h3>Claim Dishes</h3>
                    <p>Browse the recipe library and claim what you'll bring. See what others are bringing in real-time.</p>
                </div>
                <div className="feature-card">
                    <div className="card-icon">
                        <Users size={18} color="var(--primary)" />
                    </div>
                    <h3>Share Recipes</h3>
                    <p>Build a shared recipe library with your community. Rate and review dishes after each event.</p>
                </div>
            </section>

            {/* LIVE EVENTS FEED (NEW) */}
            <section style={{ padding: '3rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Upcoming Potlucks</h2>

                {events.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No events found. Be the first to host one!</p>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {events.map(event => (
                            <div key={event.id} className="feature-card" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ marginTop: 0 }}>{event.title}</h3>
                                    <p style={{ margin: '5px 0' }}><strong>Date:</strong> {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</p>
                                    <p style={{ margin: '5px 0' }}><strong>Location:</strong> {event.location}</p>
                                </div>
                                <Link to={`/events/${event.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                    RSVP
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA BANNER */}
            <section className="cta-container">
                <h2>Ready to get started?</h2>
                <p>Join PotluckHub and start organizing your next gathering</p>
                <Link to="/register" className="btn-primary">Create your account</Link>
            </section>

            <footer>
                2026 PotluckHub.
            </footer>
        </div>
    )
}