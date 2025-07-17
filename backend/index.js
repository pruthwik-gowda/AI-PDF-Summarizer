require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summary");

const app = express();
const corsOptions = {
  origin: [
    'https://ai-pdf-summarizer-wi24.vercel.app', // Your frontend domain
    'http://localhost:3000', // For local development
    'http://localhost:5173', // For Vite local development
    'https://ai-pdf-summarizer-ten.vercel.app' // Your backend domain (for testing)
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/", summaryRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
