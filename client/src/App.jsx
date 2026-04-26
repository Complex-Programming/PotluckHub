import { BrowserRouter, HashRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Register from "./pages/Register";
import EventDetail from './pages/EventDetail';
import RecipeLibrary from './pages/RecipeLibrary';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import Events from './pages/Events';
import './App.css';

function App() {
  return (
    <>
      {/* The router controls which page component renders below the header */}
      <HashRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/recipes" element={<RecipeLibrary />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;