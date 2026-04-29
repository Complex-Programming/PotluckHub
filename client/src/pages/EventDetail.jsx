import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getEventById, getEventAttendees, submitRSVP, cancelRSVP, getEventDishes, getAllRecipes, claimDish } from '../services/EventsAPI';

export default function EventDetail({ currentUser }) {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [eventData, attendeeData, dishData, libraryData] = await Promise.all([
                getEventById(id),
                getEventAttendees(id),
                getEventDishes(id),
                getAllRecipes(),
            ]);
            setEvent(eventData);
            setAttendees(attendeeData);
            setDishes(dishData);
            setLibrary(libraryData);
            setLoading(false);
        };
        fetchData();
    }, [id]);

    const isAttending = attendees.some(person => person.id === currentUser.id);

    const handleRSVP = async () => {
        if (isAttending) {
            setAttendees(prev => prev.filter(person => person.id !== currentUser.id));
            await cancelRSVP(id, currentUser.id);
        } else {
            setAttendees(prev => [...prev, currentUser]);
            await submitRSVP(id, currentUser.id);
        }
    };

    const handleClaimDish = async (recipe) => {
        const optimisticDish = { ...recipe, provider_id: currentUser.id, provider_name: currentUser.username };
        setDishes(prev => [...prev, optimisticDish]);
        setIsModalOpen(false);
        try {
            await claimDish(id, recipe.id, currentUser.id);
        } catch {
            alert("Oops! Someone already claimed that dish or an error occurred.");
            setDishes(prev => prev.filter(d => d.id !== recipe.id));
        }
    };

    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Loading event details...</h2>;
    if (!event) return <h2 style={{ textAlign: 'center', marginTop: '3rem' }}>Event not found!</h2>;

    const availableRecipes = library.filter(recipe => !dishes.some(dish => dish.id === recipe.id));

    return (
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.5rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                ← Back to Homepage
            </Link>

            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #eaeaea' }}>
                <h1 style={{ marginTop: 0, fontSize: '2.5rem' }}>{event.title}</h1>
                <p style={{ fontSize: '1.2rem', color: '#555' }}>{event.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', margin: '2rem 0', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <div><strong>📅 Date:</strong> {event.event_date ? event.event_date.split('T')[0] : 'TBD'}</div>
                    <div><strong>⏰ Time:</strong> {event.event_time || 'TBD'}</div>
                    <div><strong>📍 Location:</strong> {event.location}</div>
                    <div><strong>👑 Host ID:</strong> {event.host_id}</div>
                </div>

                <hr style={{ borderTop: '1px solid #eaeaea', margin: '2rem 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* LEFT COLUMN: GUEST LIST */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ marginTop: 0 }}>Guest List ({attendees.length})</h2>
                            <button onClick={handleRSVP} className={isAttending ? 'btn-secondary' : 'btn-primary'} style={{ padding: '0.5rem 1rem' }}>
                                {isAttending ? 'Cancel RSVP' : 'RSVP'}
                            </button>
                        </div>
                        {attendees.length === 0 ? (
                            <p style={{ color: '#666' }}>No one has RSVP'd yet.</p>
                        ) : (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {attendees.map(person => (
                                    <li key={person.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                        👤 {person.name} {person.id === currentUser.id && <span style={{ color: 'var(--text-light)', fontSize: '0.9em' }}>(You)</span>}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    {/* RIGHT COLUMN: POTLUCK MENU */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ marginTop: 0 }}>The Menu</h2>
                            {isAttending && (
                                <button onClick={() => setIsModalOpen(true)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                    Bring a Dish
                                </button>
                            )}
                        </div>

                        {!isAttending && <p style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>RSVP to bring a dish!</p>}

                        {dishes.length === 0 ? (
                            <p style={{ color: '#666' }}>The menu is empty. Claim a dish!</p>
                        ) : (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {dishes.map(dish => (
                                    <li key={dish.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                                        🍲 <strong>{dish.name}</strong>
                                        <br />
                                        <span style={{ fontSize: '0.85rem', color: '#666' }}>Brought by: {dish.provider_name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </div>
            </div>

            {/* DISH CLAIM MODAL */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ margin: 0 }}>Recipe Library</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>

                        {availableRecipes.length === 0 ? (
                            <p>No available recipes to claim. Time to add some to the library!</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {availableRecipes.map(recipe => (
                                    <div key={recipe.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.5rem 0' }}>{recipe.name}</h4>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{recipe.description}</p>
                                        </div>
                                        <button onClick={() => handleClaimDish(recipe)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                                            Bring This
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}
