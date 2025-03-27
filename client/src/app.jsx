import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateRecipes from './pages/CreateRecipes';
import SavedRecipies from './pages/SavedRecipies';
import Dashboard from './pages/Dashboard';
import './styles/index.css';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-recipes" element={<CreateRecipes />} />
        <Route path="/saved-recipes" element={<SavedRecipies />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
