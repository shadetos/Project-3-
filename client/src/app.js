// TODO: The root component managing global layout, routing, or context providers.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateRecipes from './pages/CreateRecipes';
import SavedRecipies from './pages/SavedRecipies';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      {/* Navigation bar displayed at the top */}
      <NavBar />

      {/* Define the different routes/pages here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-recipes" element={<CreateRecipes />} />
        <Route path="/saved-recipes" element={<SavedRecipies />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Footer displayed at the bottom of every page */}
      <Footer />
    </Router>
  );
}

export default App;
