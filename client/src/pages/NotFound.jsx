import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="text-4xl font-bold text-gray-900">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-4">Sorry, we couldn't find the page you're looking for.</p>
      <div className="mt-6">
        <Link to="/" className="btn">Go back home</Link>
      </div>
    </div>
  );
};

export default NotFound;
