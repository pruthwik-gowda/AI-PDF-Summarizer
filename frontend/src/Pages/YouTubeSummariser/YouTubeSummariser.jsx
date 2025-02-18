import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function YouTubeSummariser() {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!url.trim()) return alert("Please enter a YouTube URL!");

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("https://ai-pdf-summarizer-ten.vercel.app/summarize-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      setSummary(data.summary || "Error generating summary.");
    } catch (error) {
      console.error("Error:", error);
      setSummary("An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "97vh", justifyContent: "center", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>🎥 YouTube Video Summarizer</h1>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            border: "none", 
            background: "#007BFF",
            color: "white", 
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span>📄</span> PDF Summarizer
        </button>
        <button 
          onClick={() => navigate('/text-summarise')}
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            border: "none", 
            background: "#28a745",
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

      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
        <input
          type="text"
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginBottom: "10px"
          }}
          placeholder="Enter YouTube video URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          onClick={handleSummarize}
          disabled={loading}
          style={{ 
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#FF0000",
            color: "white",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <div className="loader" style={{ border: "4px solid #f3f3f3", borderRadius: "50%", borderTop: "4px solid #FF0000", width: "30px", height: "30px", animation: "spin 1s linear infinite" }}></div>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#FF0000" }}>Processing...</span>
        </div>
      )}

      {summary && !loading && (
        <div style={{ background: "#f9f9f9", borderRadius: "8px", maxWidth: "600px", textAlign: "left", width: "100%" }}>
          <h2 style={{ color: "#FF0000", textAlign: "center", marginBottom: "15px" }}>🔍 Summary:</h2>
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

export default YouTubeSummariser;