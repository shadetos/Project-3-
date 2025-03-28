import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import RecipeForm from "./pages/RecipeForm";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import Login from "./pages/Login";
import Register from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";
import { RecipeProvider } from "./context/RecipeContext";
import { AuthProvider } from "./context/authContext";
import "./styles/index.css";
import "./utils/apiClient";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <RecipeProvider>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar />
            <main className="flex-grow container mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/create" element={<RecipeForm />} />
                  <Route path="/saved" element={<SavedRecipes />} />
                  <Route path="/recipe/:id" element={<RecipeDetailPage />} />
                </Route>

                {/* Redirect to login if no route matches */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </main>
            <footer className="bg-white border-t border-gray-200 py-4">
              <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Recipe Generator App
              </div>
            </footer>
          </div>
        </RecipeProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
