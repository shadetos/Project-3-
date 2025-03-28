import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipeForm from "./pages/RecipeForm";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import NavBar from "./components/NavBar";
import { RecipeProvider } from "./context/RecipeContext";
import "./styles/index.css";

const App = () => {
  return (
    <RecipeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <NavBar />
          <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<RecipeForm />} />
              <Route path="/saved" element={<SavedRecipes />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />{" "}
              {/* Add this route */}
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} Recipe Generator App
            </div>
          </footer>
        </div>
      </Router>
    </RecipeProvider>
  );
};

export default App;
