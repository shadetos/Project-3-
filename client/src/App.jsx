import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipeForm from "./pages/RecipeForm";
import SavedRecipes from "./pages/SavedRecipes";
import NavBar from "./components/NavBar";
import { RecipeProvider } from "./context/RecipeContext";
import "./styles/index.css";

const App = () => {
  return (
    <RecipeProvider>
      <Router>
        <NavBar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<RecipeForm />} />
            <Route path="/saved" element={<SavedRecipes />} />
          </Routes>
        </div>
      </Router>
    </RecipeProvider>
  );
};

export default App;
