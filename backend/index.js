const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Initialize GoogleGenerativeAI
const genAI = new GoogleGenerativeAI('AIzaSyD9BrEOXDCJoBgUJtRJ3zM3r8ZM_ZkZaU0');

// Summarize PDF
app.post("/summarize", upload.single("pdf"), async (req, res) => {
  const pdfBuffer = req.file.buffer; // Get the file buffer

  try {
    // Parse the PDF from the buffer
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    // Improved prompt for better structuring with subpoints
    const summaryPrompt = `
      Summarize the following PDF content. Structure the summary as follows:
      - Use main bullet points for key sections.
      - Include subpoints where necessary to provide more details.
      - Ensure statistical data, facts, and key recommendations are retained.
      - The summary should be clear and concise.

      Here is the extracted text:
      ${pdfText}
    `;

    // Send extracted text to Gemini AI for summarization
    const summary = await summarizeTextWithGemini(summaryPrompt);

    // Send the structured summary to the frontend
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the PDF." });
  }
});

// Summarize YouTube video
app.post("/summarize-youtube", async (req, res) => {
  try {
    const { url } = req.body;
    // Logic to extract YouTube transcript (use YouTube API or third-party services)
    const summary = await summarizeWithGemini(`This is the url of the youtube video i want you to summarize - ${url}`);
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing YouTube video:", error);
    res.status(500).json({ error: "Error processing YouTube video." });
  }
});

// Summarize Text Input
app.post("/summarize-text", async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await summarizeWithGemini(`I want you to summarize (neatly with points and subpoints, and don't leave out any statistics or points) whatever in entered as a text aftet this sentence. Here is the text (wrapped by '###') - ###${text}###`);
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing text:", error);
    res.status(500).json({ error: "Error processing text input." });
  }
});

// Function to summarize text with Gemini AI
async function summarizeWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI summarization error:", error);
    return "Error summarizing text.";
  }
}

// Dummy function for YouTube transcript retrieval (replace with actual API logic)
async function getYouTubeTranscript(url) {
  return "Sample transcript of YouTube video"; // Replace with actual YouTube transcript extraction logic
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
