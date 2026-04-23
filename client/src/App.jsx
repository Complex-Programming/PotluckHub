import { BrowserRouter, HashRouter,Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import Register from "./pages/Register";
import EventDetail from './pages/EventDetail';
import RecipeLibrary from './pages/RecipeLibrary';
import CreateEvent from './pages/CreateEvent';
import './App.css';

function App() {
  return (
      <>
      {/* The router controls which page component renders below the header */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/recipes" element={<RecipeLibrary />} />
          <Route path="/create-event" element={<CreateEvent />} />
        </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;