import react from "react";
import "../styles/Homepage.css"

function Homepage() {
    return (
        <div className="homepage-container">

            {/* HERO */}
            <div className="hero-container">
                <h1>Plan perfect potlucks, <br /> every time</h1>
                <p>Coordinate dishes, track RSVPs, and share recipes with your community. No more duplicate dishes or forgotten plates.</p>
                <button className="btn-primary">Get started free →</button>
            </div>

            {/* FEATURE CARDS */}
            <section className="features-container">
                <div className="feature-card">
                    <h3>Create Events</h3>
                    <p>Set up potluck gatherings with date, time, and location. Invite guests and track RSVPs effortlessly.</p>
                </div>
                <div className="card">
                    <h3>Claim Dishes</h3>
                    <p>Browse the recipe library and claim what you'll bring. See what others are bringing in real-time.</p>
                </div>
                <div className="card">
                    <h3>Share Recipes</h3>
                    <p>Build a shared recipe library with your community. Rate and review dishes after each event.</p>
                </div>
            </section>

            {/* CTA BANNER */}
            <section>
                <h2>Ready to get started?</h2>
                <p>Join PotluckHub and start organizing your next gathering</p>
                <button className="btn-primary">Create your account →</button>
            </section>

            <footer>
                2026 PotluckHub. This is a wireframe preview.
            </footer>
        </div>
    )
}

export default Homepage