import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const NavBar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Ensure local storage is clear
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-lg font-bold">
        Recipe Generator
      </Link>

      <div className="flex items-center">
        {currentUser ? (
          // Links for authenticated users
          <>
            <Link to="/create" className="mx-2 hover:text-gray-300">
              Create Recipe
            </Link>
            <Link to="/saved" className="mx-2 hover:text-gray-300">
              Saved Recipes
            </Link>
            <button
              onClick={handleLogout}
              className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
            <span className="ml-3 text-sm text-gray-400">
              {currentUser.username}
            </span>
          </>
        ) : (
          // Links for unauthenticated users
          <>
            <button
              onClick={handleLoginClick}
              className="mx-2 hover:text-gray-300 bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
            <Link to="/register" className="mx-2 hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
