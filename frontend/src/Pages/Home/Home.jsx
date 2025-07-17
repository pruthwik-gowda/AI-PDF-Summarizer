import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [pdf, setPdf] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

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
    setLoading(true);
    setSummary(null);
    setSaveStatus("");

    try {
      const response = await axios.post(
        "http://localhost:5000/summarize",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setSummary("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save summaries.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/save-summary",
        {
          type: "pdf",
          summary: summary,
          original: "PDF uploaded content",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      if (response.status === 200) {
        setSaveStatus("✅ Summary saved successfully!");
      } else {
        setSaveStatus("❌ Failed to save summary.");
      }
    } catch (err) {
      console.error(err);
      setSaveStatus("❌ Error saving summary.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "97vh", justifyContent: "center", textAlign: "center", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>📄 PDF Summarizer</h1>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        {/* Hidden file input */}
        <input
          type="file"
          accept=".pdf"
          id="pdf-upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Custom upload button */}
        <label htmlFor="pdf-upload" style={{ ...actionButtonStyle("#007BFF"), cursor: "pointer" }}>
          📤 Upload PDF
        </label>

        {/* Show selected file name */}
        {pdf && (
          <span style={{ fontSize: "14px", color: "#555" }}>
            Selected: {pdf.name.length > 30 ? pdf.name.slice(0, 30) + "..." : pdf.name}
          </span>
        )}

        {/* Upload and summarize */}
        <button
          onClick={handleUpload}
          style={actionButtonStyle("#007BFF")}
        >
          🔍 Summarize
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <div className="loader" style={loaderStyle}></div>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#007BFF" }}>Processing...</span>
        </div>
      )}

      {summary && !loading && (
        <>
          <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", maxWidth: "600px", textAlign: "left" }}>
            <h2 style={{ color: "#007BFF", textAlign: "center" }}>🔍 Summary:</h2>
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>

          <button
            onClick={handleSaveSummary}
            style={{ ...actionButtonStyle("#6f42c1"), margin: "15px" }}
          >
            💾 Save Summary
          </button>

          {saveStatus && (
            <p style={{ marginTop: "10px", fontWeight: "bold", color: saveStatus.includes("✅") ? "#28a745" : "#dc3545" }}>
              {saveStatus}
            </p>
          )}
        </>
      )}

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

const actionButtonStyle = (bg) => ({
  padding: "10px 15px",
  cursor: "pointer",
  borderRadius: "5px",
  border: "none",
  background: bg,
  color: "white",
  fontSize: "16px",
  fontFamily: "'Poppins', sans-serif"
});

const loaderStyle = {
  border: "4px solid #f3f3f3",
  borderRadius: "50%",
  borderTop: "4px solid #007BFF",
  width: "30px",
  height: "30px",
  animation: "spin 1s linear infinite",
};

export default Home;
