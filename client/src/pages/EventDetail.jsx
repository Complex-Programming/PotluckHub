import {useParams} from 'react-router';

export default function EventDetail() {
    const {id } = useParams(); // Get the event ID from the URL parameters
    
    // For now, we'll just display the event ID. In a real application, you would fetch the event details using this ID.
    return (
        <div>
            <h1>Event Detail Page</h1>
            <p>Event ID: {id}</p>
        </div>
    );
}