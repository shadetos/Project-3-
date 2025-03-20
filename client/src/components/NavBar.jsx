// client/src/components/NavBar.jsx
// TODO: Navigation bar for routing to pages like Home, Dashboard, Saved Recipes, etc.

import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav style={styles.navbar}>
      {/* LOGO / BRAND NAME */}
      <div style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          <span style={styles.brandText}>Recipe Generator</span>
        </Link>
      </div>

      {/* NAV LINKS */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          Home
        </Link>
        <Link to="/create-recipes" style={styles.link}>
          Create Recipe
        </Link>
        <Link to="/saved-recipes" style={styles.link}>
          Saved Recipes
        </Link>
        <Link to="/dashboard" style={styles.link}>
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

// Inline styles (minimal for demonstration)
const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#eee',
    borderBottom: '1px solid #ccc',
  },
  brand: {
    fontWeight: 'bold',
  },
  brandLink: {
    textDecoration: 'none',
  },
  brandText: {
    fontSize: '1.25rem',
    color: '#333',
  },
  links: {
    display: 'flex',
    gap: '1rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: '500',
  },
};

export default NavBar;
