import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // <-- Import CSS here

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>🧠 AI Summarizer</div>

      <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <li><Link to="/text-summarise">Text</Link></li>
        <li><Link to="/">PDF</Link></li>
        <li><Link to="/youtube">YouTube</Link></li>
        <li><Link to="/profile">Profile</Link></li>
        {!isLoggedIn ? (
          <li><Link to="/login">Login</Link></li>
        ) : (
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
