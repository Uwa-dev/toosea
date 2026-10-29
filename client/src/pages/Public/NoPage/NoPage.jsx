import React from "react";
import { Link } from "react-router-dom";
import "./nopage.css";

const NoPage = () => {
  return (
    <div className="no-page">
      <div className="no-page-content">
        <h1>404</h1>

        <h2>Page Not Found</h2>

        <p>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link to="/" className="no-page-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NoPage;