import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => navigate("/")}>🧠 AI Summarizer</div>
      <ul style={styles.navLinks}>
        <li><Link to="/text-summarise" style={styles.link}>Text</Link></li>
        <li><Link to="/" style={styles.link}>PDF</Link></li>
        <li><Link to="/youtube" style={styles.link}>YouTube</Link></li>
        <li><Link to="/profile" style={styles.link}>Profile</Link></li>
        {!isLoggedIn ? (
          <li><Link to="/login" style={styles.link}>Login</Link></li>
        ) : (
          <li><button onClick={handleLogout} style={styles.logoutButton}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    color: "white",
    height: "50px",
    margin: 0,
  },
  logo: {
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "20px",
  },
  navLinks: {
    display: "flex",
    gap: "15px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    marginRight: "20px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
  },
  logoutButton: {
    padding: "6px 12px",
    background: "white",
    color: "#007BFF",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "'Poppins', sans-serif"
  },
};

export default Navbar;
