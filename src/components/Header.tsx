import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>📚 Book Edition Compare</h1>
        </Link>
        <nav className="nav">
          <Link to="/">Search</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/curated-lists">Curated Lists</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
