import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";

function TextSummariser() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const handleSummarize = async () => {
    if (!text.trim()) return alert("Enter some text to summarize!");

    setLoading(true);
    setSummary("");
    setSaveStatus("");

    try {
      const response = await fetch("https://ai-pdf-summarizer-ten.vercel.app/summarize-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSummary(data.summary || "Error generating summary.");
    } catch (error) {
      console.error("Error:", error);
      setSummary("An error occurred.");
    }

    setLoading(false);
  };

  const handleSaveSummary = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save summaries.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("https://ai-pdf-summarizer-ten.vercel.app/save-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          type: "text",
          summary: summary,
          original: text,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSaveStatus("✅ Summary saved successfully!");
        alert("✅ Summary saved!"); // ✅ Alert added here
      } else {
        setSaveStatus("❌ Failed to save summary.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveStatus("❌ Error saving summary.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "97vh",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h1 style={{ color: "#007BFF", marginBottom: "20px" }}>📝 Text Summarizer</h1>

      {/* Input Area */}
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
            resize: "vertical",
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
            background: "#28a745",
            color: "white",
            fontSize: "16px",
            opacity: loading ? 0.7 : 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div className="loader" style={loaderStyle}></div>
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#007BFF",
            }}
          >
            Processing...
          </span>
        </div>
      )}

      {/* Summary Output */}
      {summary && !loading && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "600px",
            textAlign: "left",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          <h2
            style={{
              color: "#007BFF",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            🔍 Summary:
          </h2>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}

      {/* Save Summary Button */}
      {summary && !loading && (
        <button
          onClick={handleSaveSummary}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#6f42c1",
            color: "white",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "20px",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          💾 Save Summary
        </button>
      )}

      {/* Save Status Text */}
      {saveStatus && (
        <p
          style={{
            marginTop: "10px",
            fontWeight: "bold",
            color: saveStatus.includes("✅") ? "#28a745" : "#dc3545",
          }}
        >
          {saveStatus}
        </p>
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

const loaderStyle = {
  border: "4px solid #f3f3f3",
  borderRadius: "50%",
  borderTop: "4px solid #007BFF",
  width: "30px",
  height: "30px",
  animation: "spin 1s linear infinite",
};

export default TextSummariser;
