require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");

const app = express();
const upload = multer();
app.use(cors());
app.use(bodyParser.json());


// Upload resume and extract text
app.post("/upload", upload.single("file"), async (req, res) => {
  const data = await pdfParse(req.file.buffer);
  res.json({ resumeText: data.text });
});

// Generate cover letter
app.post("/generate", async (req, res) => {
  const { resumeText, jobDescription, tone } = req.body;

  const prompt = `
You are a professional career coach.
Write a ${tone || "professional"} cover letter based on the resume and job description.

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: prompt,
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ coverLetter: response.data.generations[0].text });
  } catch (err) {
    console.error("Cohere generate error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});


// Resume-job keyword match analysis
app.post("/analyze", (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: "Missing resume or job description" });
  }

  const getWords = text => new Set(text.toLowerCase().match(/\b\w{4,}\b/g) || []);
  const resumeWords = getWords(resumeText);
  const jobWords = getWords(jobDescription);

  const commonWords = [...jobWords].filter(word => resumeWords.has(word));
  const missingWords = [...jobWords].filter(word => !resumeWords.has(word));
  const matchScore = ((commonWords.length / jobWords.size) * 100).toFixed(1);

  res.json({
    totalResumeWords: resumeWords.size,
    totalJobWords: jobWords.size,
    commonWords: commonWords.slice(0, 20),
    missingWords: missingWords.slice(0, 20),
    matchScore
  });
});


// ATS check with Cohere embedding
app.post("/ats-check", async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: "Missing resume or job description" });
  }

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/embed",
      {
        texts: [resumeText, jobDescription],
        model: "embed-english-v3.0",
        input_type: "search_document", // ✅ Required by Cohere now
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const [resumeVector, jdVector] = response.data.embeddings;

    const dot = resumeVector.reduce((acc, val, i) => acc + val * jdVector[i], 0);
    const magnitudeA = Math.sqrt(resumeVector.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(jdVector.reduce((acc, val) => acc + val * val, 0));
    const similarity = dot / (magnitudeA * magnitudeB);

    const score = Math.round(similarity * 100);

    res.json({
      score,
      issues: score > 75 ? [] : ["Resume and job description are not closely aligned. Add more relevant skills/keywords."],
    });
  } catch (err) {
    console.error("Cohere Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Cohere analysis failed." });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
