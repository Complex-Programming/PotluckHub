import { BrowserRouter, Routes, Route } from 'react-router';
import Homepage from './pages/Homepage';
import EventDetail from './pages/EventDetail';
import RecipeLibrary from './pages/RecipeLibrary';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/recipes" element={<RecipeLibrary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;