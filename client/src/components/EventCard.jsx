import React from "react";
import "../styles/EventCard.css"

export default function EventCard({ event }) {
    const { title, description, event_date } = event;

    return (
        <div className="card-container">
            <div className="title-container">
                <h1>{event.title}</h1>
            </div>
            <div className="description-event-container">
                <p>{event.description}</p>
            </div>
            <div className="information-event-container">
                <div>📅 {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                <div>⏰ {event.event_time}</div>
                <div>📍 {event.location}</div>
            </div>
            <div className="hosted-by-container">
                Hosted by {event.host}
            </div>
        </div>
    )
}