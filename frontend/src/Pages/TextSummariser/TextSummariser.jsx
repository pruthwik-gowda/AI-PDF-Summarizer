import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function TextSummariser() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Enter some text to summarize!");

    setLoading(true);
    setSummary("");

    try {
      const response = await fetch("https://ai-pdf-summarizer-ten.vercel.app/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minHeight: "97vh", justifyContent: "center", textAlign: "center", fontFamily: "Arial, sans-serif"}}>
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>📝 Text Summarizer</h1>

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
          onClick={() => navigate('/youtube')}
          style={{ 
            padding: "10px 20px", 
            cursor: "pointer", 
            borderRadius: "5px", 
            border: "none", 
            background: "#FF0000",
            color: "white", 
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "5px"
          }}
        >
          <span>🎥</span> YouTube Summarizer
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "20px" }}>
        <textarea
          style={{
            width: "100%",
            minHeight: "150px",
            padding: "15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            marginBottom: "10px",
            resize: "vertical"
          }}
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          onClick={handleSummarize}
          disabled={loading}
          style={{ 
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#007BFF",
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
          <div className="loader" style={{ border: "4px solid #f3f3f3", borderRadius: "50%", borderTop: "4px solid #007BFF", width: "30px", height: "30px", animation: "spin 1s linear infinite" }}></div>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#007BFF" }}>Processing...</span>
        </div>
      )}

      {summary && !loading && (
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", maxWidth: "600px", textAlign: "left", width: "100%" }}>
          <h2 style={{ color: "#007BFF", textAlign: "center", marginBottom: "15px" }}>🔍 Summary:</h2>
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

export default TextSummariser;