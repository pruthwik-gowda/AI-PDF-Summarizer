import { useState } from "react";
import ReactMarkdown from "react-markdown";

function TextSummariser() {
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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Text Summarizer</h1>
      <textarea
        className="border rounded-md w-full max-w-lg p-2"
        rows="5"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={handleSummarize}
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md w-full max-w-lg">
          <h2 className="font-bold">Summary:</h2>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default TextSummariser;
