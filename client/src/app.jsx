import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth context provider
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import SavedRecipes from "./pages/SavedRecipes";
import RecipeForm from "./pages/RecipeForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Components
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public route for landing page (no navbar) */}
            <Route path="/welcome" element={<Landing />} />

            {/* Auth routes (no navbar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Routes with NavBar and Footer */}
            <Route
              path="/*"
              element={
                <>
                  <NavBar />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<HomePage />} />

                      {/* Protected routes */}
                      <Route
                        path="/saved-recipes"
                        element={
                          <ProtectedRoute>
                            <SavedRecipes />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/create-recipes"
                        element={
                          <ProtectedRoute>
                            <RecipeForm />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
