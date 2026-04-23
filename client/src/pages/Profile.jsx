import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getUserProfile } from '../services/UsersAPI';
import '../styles/Profile.css';

export default function Profile() {
    const currentUserId = 1;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile(currentUserId);
            setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <h2 className="profile-status">Loading profile...</h2>;
    }

    if (!profile) {
        return <h2 className="profile-status">Profile not found.</h2>;
    }

    return (
        <main className="profile-page">
            <h1>{profile.name}</h1>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>

            <section className="profile-section">
                <h2 className="profile-section-title">Hosted Events</h2>
                {profile.hosted_events.length === 0 ? (
                    <p>No hosted events yet.</p>
                ) : (
                    <ul className="profile-events-list">
                        {profile.hosted_events.map((event) => (
                            <li key={event.id}>
                                <Link to={`/events/${event.id}`}>{event.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="profile-section-title">RSVPed Events</h2>
                {profile.attending_events.length === 0 ? (
                    <p>No RSVPs yet.</p>
                ) : (
                    <ul className="profile-events-list">
                        {profile.attending_events.map((event) => (
                            <li key={event.id}>
                                <Link to={`/events/${event.id}`}>{event.title}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}
