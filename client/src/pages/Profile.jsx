import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { logout } from '../services/AuthAPI';
import { getUserProfile, updateUserBio } from '../services/UsersAPI';
import { getAuthUser } from '../services/AuthAPI';
import '../styles/Profile.css';

export default function Profile() {
    const fallbackUserId = 1;
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [bioDraft, setBioDraft] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            // try session-based auth first
            const auth = await getAuthUser();
            if (!auth) {
                setLoading(false);
                navigate('/login');
                return;
            }

            if (auth) {
                const simple = {
                    id: auth.id,
                    name: auth.username || auth.name || 'GitHub User',
                    email: auth.email || '',
                    bio: auth.bio || '',
                    avatarUrl: auth.avatarUrl || auth.avatar_url || null,
                    hosted_events: [],
                    attending_events: [],
                };
                setProfile(simple);
                setBioDraft(simple.bio || '');
                setLoading(false);
                return;
            }
            // fallback to DB user profile (shouldn't reach here because we redirect)
            const data = await getUserProfile(fallbackUserId);
            setProfile(data);
            setBioDraft(data?.bio || '');
            setLoading(false);
        };

        fetchProfile();
    }, []);

    if (loading) return <h2 className="profile-status">Loading profile...</h2>;
    if (!profile) return <h2 className="profile-status">Profile not found.</h2>;

    const handleSaveBio = async () => {
        setSaving(true);
        setError('');

        if (!profile.id) {
            setError('Missing user id. Please log in again.');
            setSaving(false);
            return;
        }

        const updated = await updateUserBio(profile.id, bioDraft);
        if (!updated) {
            setError('Could not save bio. Please try again.');
            setSaving(false);
            return;
        }

        setProfile((prev) => ({
            ...prev,
            bio: updated.bio ?? bioDraft,
        }));
        setIsEditing(false);
        setSaving(false);
    };

    return (
        <main className="profile-page">
            {profile.avatarUrl && (
                <img src={profile.avatarUrl} alt="avatar" style={{ width: 96, borderRadius: 48 }} />
            )}
            <h1>{profile.name}</h1>
            {profile.email && <p className="profile-email">{profile.email}</p>}
            {isEditing ? (
                <div className="profile-bio-edit">
                    <textarea
                        className="profile-bio-input"
                        value={bioDraft}
                        onChange={(e) => setBioDraft(e.target.value)}
                        rows={4}
                        placeholder="Tell people about yourself..."
                    />
                    <div className="profile-bio-actions">
                        <button
                            className="btn-primary"
                            onClick={handleSaveBio}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                setBioDraft(profile.bio || '');
                                setIsEditing(false);
                                setError('');
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </button>
                    </div>
                    {error && <p className="profile-error">{error}</p>}
                </div>
            ) : (
                <div className="profile-bio-row">
                    <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>
                    <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                        Edit bio
                    </button>
                </div>
            )}

            <div style={{ margin: '1rem 0' }}>
                <button onClick={async () => { await logout(); navigate('/login'); }} className="btn-primary">Logout</button>
            </div>

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
