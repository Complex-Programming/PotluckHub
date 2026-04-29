import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../services/AuthAPI';
import { getUserProfile, updateUserBio } from '../services/UsersAPI';
import { getAuthUser } from '../services/AuthAPI';
import EventCard from '../components/EventCard';
import '../styles/Profile.css';

export default function Profile() {
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

            const data = await getUserProfile(auth.id);
            const merged = {
                id: auth.id,
                name: auth.username || auth.name || data?.username || 'GitHub User',
                email: auth.email || '',
                bio: data?.bio ?? auth.bio ?? '',
                avatarUrl: auth.avatarurl || auth.avatarUrl || auth.avatar_url || data?.avatarurl || null,
                hosted_events: data?.hosted_events || [],
                attending_events: data?.attending_events || [],
            };
            setProfile(merged);
            setBioDraft(merged.bio || '');
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
            <header className="profile-header">
                <div className="profile-identity">
                    {profile.avatarUrl && (
                        <img className="profile-avatar" src={profile.avatarUrl} alt="avatar" />
                    )}
                    <div className="profile-identity-text">
                        <h1>{profile.name}</h1>
                        {profile.email && <p className="profile-email">{profile.email}</p>}
                    </div>
                </div>
                {!isEditing && (
                    <button
                        className="btn-secondary profile-button"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit bio
                    </button>
                )}
            </header>

            <section className="profile-bio-card">
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
                                className="btn-primary profile-button"
                                onClick={handleSaveBio}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                className="btn-secondary profile-button"
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
                    <p className="profile-bio">{profile.bio || 'No bio added yet.'}</p>
                )}
            </section>

            <div style={{ margin: '1rem 0' }}>
                <button
                    onClick={async () => { await logout(); navigate('/login'); }}
                    className="btn-primary profile-button"
                >
                    Logout
                </button>
            </div>

            <section className="profile-section">
                <h2 className="profile-section-title">Hosted Events</h2>
                {(!profile.hosted_events || profile.hosted_events.length === 0) ? (
                    <p>No hosted events yet.</p>
                ) : (
                    <div className="events-container">
                        {profile.hosted_events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>

            <section className="profile-section">
                <h2 className="profile-section-title">RSVPed Events</h2>
                {(!profile.attending_events || profile.attending_events.length === 0) ? (
                    <p>No RSVPs yet.</p>
                ) : (
                    <div className="events-container">
                        {profile.attending_events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
