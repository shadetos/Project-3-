// NavBar.jsx
import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="text-lg font-bold">
        Recipe Generator
      </Link>
      <div>
        <Link to="/create" className="mx-2">
          Create Recipe
        </Link>
        <Link to="/saved" className="mx-2">
          Saved Recipes
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
