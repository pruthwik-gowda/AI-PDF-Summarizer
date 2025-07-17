const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Summarize PDF
router.post("/summarize", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    const prompt = ` Summarize the following PDF content. Structure the summary as follows:
      - Use main bullet points for key sections.
      - Include subpoints where necessary to provide more details.
      - Ensure statistical data, facts, and key recommendations are retained.
      - The summary should be clear and concise.
      - Dont include any other unrelated texts in the end or beginning, this is not a chat

      Here is the extracted text:\n${pdfText}`;
    const summary = await summarizeWithGemini(prompt);

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error summarizing PDF." });
  }
});

// Summarize text
router.post("/summarize-text", async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await summarizeWithGemini(`Summarize: ${text}`);
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error summarizing text." });
  }
});

// Save summary (Authenticated)
router.post("/save-summary", auth, async (req, res) => {
  const { type, summary, original } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.summaries.push({ type, content: summary, original });
    await user.save();
    res.json({ msg: "Summary saved." });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving summary");
  }
});

// Get user summaries
router.get("/my-summaries", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.summaries);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching summaries");
  }
});

app.get('/', (req, res) => {
  res.send('API is working!');
});

// Gemini Summarization Function
async function summarizeWithGemini(text) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(text);
    return result.response.text();
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Error generating summary.";
  }
}

module.exports = router;
