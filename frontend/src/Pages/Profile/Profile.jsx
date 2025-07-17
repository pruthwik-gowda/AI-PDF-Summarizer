import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

function Profile() {
  const [summaries, setSummaries] = useState([]);
  const [selectedSummary, setSelectedSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSummaries = async () => {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in to view summaries.");

      try {
        const response = await fetch("https://ai-pdf-summarizer-ten.vercel.app/my-summaries", {
          headers: {
            "x-auth-token": token,
          },
        });
        const data = await response.json();
        setSummaries(data);
      } catch (err) {
        console.error("Failed to fetch summaries", err);
      }
    };

    fetchSummaries();
  }, []);

  const openModal = (summary) => {
    setSelectedSummary(summary);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedSummary(null);
    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "'Poppins', sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#007BFF" }}>
        📂 Your Saved Summaries
      </h2>

      {summaries.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No summaries found.
        </p>
      ) : (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {summaries.map((summary, index) => (
            <li
              key={index}
              onClick={() => openModal(summary)}
              style={{
                cursor: "pointer",
                margin: "10px 0",
                padding: "10px 15px",
                background: "#f1f1f1",
                borderRadius: "8px",
                border: "1px solid #ddd",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#e9e9e9")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "#f1f1f1")
              }
            >
              <strong>{summary.type.toUpperCase()} Summary</strong>
              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginTop: "4px",
                }}
              >
                {summary.original.slice(0, 60)}...
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {showModal && selectedSummary && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <button onClick={closeModal} style={modalStyles.closeBtn}>
              ✖
            </button>
            <h3 style={{ color: "#007BFF", textAlign: "center" }}>
              {selectedSummary.type.toUpperCase()} Summary
            </h3>
            <div style={{ marginTop: "10px" }}>
              <h4>🔸 Original:</h4>
              <div style={modalStyles.scrollBox}>
                <ReactMarkdown>{selectedSummary.original}</ReactMarkdown>
              </div>
              <h4 style={{ marginTop: "15px" }}>🔍 Summary:</h4>
              <div style={modalStyles.scrollBox}>
                <ReactMarkdown>{selectedSummary.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "15px",
    border: "none",
    background: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  scrollBox: {
    background: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px",
    maxHeight: "250px",
    overflowY: "auto",
    border: "1px solid #ddd",
  },
};

export default Profile;
