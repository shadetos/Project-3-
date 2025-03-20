// TODO: This global footer appears on every page and may include links or social media icons.
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.info}>
        <p style={styles.text}>2025 Recipe Generator App</p>
        <p style={styles.text}>All rights reserved</p>
      </div>
      <div style={styles.links}>
        <Link to="/about" style={styles.link}>
          About
        </Link>
        <Link to="/contact" style={styles.link}>
          Contact
        </Link>
        {/* Add more footer links here if needed */}
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    backgroundColor: '#eee',
    borderTop: '1px solid #ccc',
    marginTop: 'auto',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
  },
  text: {
    margin: 0,
    color: '#333',
    fontSize: '0.9rem',
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

export default Footer;
