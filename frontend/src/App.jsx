import React, { useState } from "react";
import axios from "axios";

function App() {
  const [pdf, setPdf] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false); // Loader state

  const handleFileChange = (event) => {
    setPdf(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!pdf) {
      alert("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    setLoading(true); // Start loader

    try {
      const response = await axios.post("http://localhost:5000/summarize", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", justifyContent: "center", textAlign: "center", fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>📄 PDF Summarizer</h1>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ padding: "10px 15px", cursor: "pointer", borderRadius: "5px", border: "none", background: "#007BFF", color: "white", fontSize: "16px" }}>Upload and Summarize</button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <div className="loader" style={{ border: "4px solid #f3f3f3", borderRadius: "50%", borderTop: "4px solid #007BFF", width: "30px", height: "30px", animation: "spin 1s linear infinite" }}></div>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#007BFF" }}>Processing...</span>
        </div>
      )}

      {summary && !loading && (
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", maxWidth: "600px", textAlign: "left" }}>
          <h2 style={{ color: "#007BFF", textAlign: "center" }}>🔍 Summary:</h2>



          <ul style={{ listStyleType: "none", padding: "0" }}>
            {summary.split("\n").map((point, index) => {
              const parts = point.split(":");
              return (
                <li key={index} style={{ marginBottom: "10px", color: "#000" }}>
                  <span style={{ fontWeight: "bold", color: "#000" }}>{parts[0]}</span>
                  <span> {parts.slice(1).join(":")}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Loader Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
