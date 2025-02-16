const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors()); // Enable CORS for all origins

// Initialize GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Function to summarize text using Google Gemini
async function summarizeTextWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate the summary using Gemini
    const result = await model.generateContent(text);
    const response = await result.response;
    const summary = response.text(); // Extract the summarized text
    return summary;
  } catch (error) {
    console.error("Error summarizing text with Gemini:", error);
    return "Error summarizing text.";
  }
}

app.post("/summarize", upload.single("pdf"), async (req, res) => {
  const pdfBuffer = req.file.buffer; // Get the file buffer

  try {
    // Parse the PDF from the buffer
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;
    const summaryPrompt = "I want you to summarize the contents of this pdf. Don't leave out any important data or statistical data. and give the answer pointwise. I would like to have subpoints as well. I dont want any other text except the summary. I'm directly rendering thsi summary in my ai summarizer app."
    // Send extracted text to Gemini AI for summarization
    const summary = await summarizeTextWithGemini(pdfText+summaryPrompt);

    // Send the summary to the frontend
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the PDF." });
  }
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:5000");
});
