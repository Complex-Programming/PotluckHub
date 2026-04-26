import React from "react";
import EventCard from "../components/EventCard";
import "../styles/Events.css"
import { Link } from "react-router";

export default function Events() {

    const events = [
        {
            id: 1,
            title: "Spring Potluck Picnic",
            description: "Bring your favorite dish and enjoy a sunny afternoon at the park!",
            event_date: "2026-05-10T00:00:00",
            event_time: "12:00 PM",
            location: "Central Park",
            host_id: 1,
            host: "Eman"
        },
        {
            id: 2,
            title: "Game Night Potluck",
            description: "Board games, snacks, and good vibes. Don’t forget something shareable!",
            event_date: "2026-05-15T00:00:00",
            event_time: "6:30 PM",
            location: "123 Main St",
            host_id: 2,
            host: "Tom"
        },
        {
            id: 3,
            title: "Holiday Feast",
            description: "Celebrate together with a full-on potluck feast!",
            event_date: "2026-12-20T00:00:00",
            event_time: "5:00 PM",
            location: "Community Center",
            host_id: 3,
            host: "Donny"
        }
    ];

    return (
        <>
            {/* HEADING OF THE PAGE */}
            <div className="heading-container">
                <h1>Potluck Events</h1>
                <Link to="/create-event">Create Event</Link>
            </div>
            
            {/* LISTING OF ALL THE EVENTS */}
            <div className="events-container">
                {events.map((event) => (
                <EventCard key={event.id} event={event}/>
                ))}
            </div>
        </>
    );
}