// TODO: Landing page that could feature a brief intro and login/register prompts.
import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
return (
<div className="landing-container">
        <header className="landing-header">
            <h1>Feastly</h1>
            <p>Create and share recipies with the world around you.</p>
        </header>
        <div className="landing buttons">
            <Link to="/login" className="landing-button">Login</Link>
            <Link to="/register" className="landing-button">Register</Link>
        </div>
    </div>
)
};

export default Landing;