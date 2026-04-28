import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { getUserProfile } from '../services/UsersAPI';
import { getAuthUser } from '../services/AuthAPI';
import '../styles/Profile.css';

export default function Profile() {
    const fallbackUserId = 1;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            // try session-based auth first
            const auth = await getAuthUser();
            if (!auth) {
                navigate('/login');
                return;
            }

            if (auth) {
                const simple = {
                    name: auth.username || auth.name || 'GitHub User',
                    email: auth.email || '',
                    bio: auth.bio || '',
                    avatarUrl: auth.avatarUrl || auth.avatar_url || null,
                    hosted_events: [],
                    attending_events: [],
                };
                setProfile(simple);
                setLoading(false);
                return;
            }
            // fallback to DB user profile (shouldn't reach here because we redirect)
            const data = await getUserProfile(fallbackUserId);
            setProfile(data);
            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) return <h2 className="profile-status">Loading profile...</h2>;
    if (!profile) return <h2 className="profile-status">Profile not found.</h2>;

    return (
        <main className="profile-page">
            {profile.avatarUrl && (
                <img src={profile.avatarUrl} alt="avatar" style={{ width: 96, borderRadius: 48 }} />
            )}
            <h1>{profile.name}</h1>
            {profile.email && <p className="profile-email">{profile.email}</p>}
            <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>

            <section className="profile-section">
                <h2 className="profile-section-title">Hosted Events</h2>
                {(!profile.hosted_events || profile.hosted_events.length === 0) ? (
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
                {(!profile.attending_events || profile.attending_events.length === 0) ? (
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
