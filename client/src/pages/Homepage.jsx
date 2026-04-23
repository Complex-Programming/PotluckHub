import react from "react";
import "../styles/Homepage.css"
import { Link } from 'react-router';
import { CalendarDays, ChefHat, Users } from 'lucide-react'

function Homepage() {
    return (
        <div className="homepage-container">

            {/* HERO */}
            <div className="hero-container">
                <h1>Plan perfect potlucks, <br /> every time</h1>
                <p>Coordinate dishes, track RSVPs, and share recipes with your community. No more duplicate dishes or forgotten plates.</p>
                <Link to="/events" className="btn-primary">Get started free →</Link>            </div>

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

            {/* CTA BANNER */}
            <section className="cta-container">
                <h2>Ready to get started?</h2>
                <p>Join PotluckHub and start organizing your next gathering</p>
                <Link to="/signup" className="btn-primary">Create your account →</Link>            </section>

            <footer>
                2026 PotluckHub. This is a wireframe preview.
            </footer>
        </div>
    )
}

export default Homepage