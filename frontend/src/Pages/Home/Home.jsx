import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Home() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [pdf, setPdf] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await axios.post(
        "https://ai-pdf-summarizer-ten.vercel.app/summarize",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "97vh", justifyContent: "center", textAlign: "center", fontFamily: "Arial, sans-serif"}}>
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>📄 PDF Summarizer</h1>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button 
          onClick={() => navigate('/youtube')}
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            border: "none", 
            background: "#FF0000", // YouTube red
            color: "white", 
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span>🎥</span> YouTube Summarizer
        </button>
        <button 
          onClick={() => navigate('/text-summarise')}
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            border: "none", 
            background: "#28a745", // Green color
            color: "white", 
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span>📝</span> Text Summarizer
        </button>
      </div>

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
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
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

export default Home;