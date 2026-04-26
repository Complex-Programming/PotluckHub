import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router';
import Homepage from './pages/Homepage';
import Register from "./pages/Register";
import EventDetail from './pages/EventDetail';
import RecipeLibrary from './pages/RecipeLibrary';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Events from './pages/Events';
import { getAllUsers } from './services/EventsAPI';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
      const fetchUsers = async () => {
          try {
              const dbUsers = await getAllUsers();
              if (dbUsers && dbUsers.length > 0) {
                  setUsers(dbUsers);
                  setCurrentUser(dbUsers[0]);
              } else {
                  setDbError(true);
              }
          } catch {
              setDbError(true);
          }
      };
      fetchUsers();
  }, []);

  if (dbError) return <div style={{ padding: '2rem', textAlign: 'center' }}>❌ Could not connect to database. Is the backend running?</div>;
  if (!currentUser) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading PotluckHub...</div>;

  return (
    <HashRouter>
      <header className="homepage-header-nav" style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: 'white', borderBottom: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className="header-nav-button" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>PotluckHub</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Viewing as:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = users.find(u => u.id === parseInt(e.target.value));
              setCurrentUser(selected);
            }}
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetail currentUser={currentUser} />} />
        <Route path="/recipes" element={<RecipeLibrary />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
