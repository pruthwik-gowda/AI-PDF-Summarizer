import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !phone || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        email,
        phone,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("User already exists.");
      } else {
        alert("Signup failed. Try again.");
      }
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "80px" }}>
      <h2>Register</h2>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
      </div>

      <button onClick={handleSignup} style={styles.button}>
        Sign Up
      </button>

      <p style={{ marginTop: "20px" }}>
        Already have an account?{" "}
        <span
          style={styles.link}
          onClick={() => navigate("/login")}
        >
          Log in
        </span>
      </p>
    </div>
  );
}

const styles = {
  input: {
    padding: "10px",
    width: "250px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  link: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Signup;
