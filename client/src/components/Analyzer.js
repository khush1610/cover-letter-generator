import React, { useState, useContext } from "react";
import axios from "axios";
import { SharedContext } from "../components/SharedContext";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Analyzer() {
  const { resumeText, setResumeText, jobDescription, setJobDescription } =
    useContext(SharedContext);
  const [commonWords, setCommonWords] = useState([]);
  const [missingWords, setMissingWords] = useState([]);
  const [matchScore, setMatchScore] = useState(null);
  const [showHighlights, setShowHighlights] = useState(false);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post(`${API_BASE}/upload`, formData);
    setResumeText(res.data.resumeText);
  };

  const handleAnalyze = async () => {
    const res = await axios.post("${API_BASE}/analyze", { resumeText, jobDescription });
    setCommonWords(res.data.commonWords);
    setMatchScore(res.data.matchScore);
    setMissingWords(res.data.missingWords);
    setShowHighlights(true);
  };

  return (
    <div className="section">
    
      <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>
        Resume & Job Description Analyzer
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ fontWeight: 500 }}>Upload Resume (PDF): </label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            style={{ marginTop: "0.5rem" }}
          />
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Job Description:</label>
          <textarea
            rows="10"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            style={{
              width: "100%",
              marginTop: "0.5rem",
              padding: "0.75rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "1rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button onClick={handleAnalyze} style={{ width: "fit-content" }}>
          Analyze & Highlight
        </button>

        {showHighlights && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Highlighted Job Description</h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {jobDescription.split(/\b/).map((word, i) =>
                commonWords.includes(word.toLowerCase()) ? (
                  <span
                    key={i}
                    style={{ background: "#fffb91", fontWeight: 500 }}
                  >
                    {word}
                  </span>
                ) : (
                  word
                )
              )}
            </p>
            <p style={{ marginTop: "1rem" }}>
              <strong>Match Score: </strong>
              <span
                style={{
                  color: matchScore > 50 ? "green" : "red",
                  fontWeight: 600,
                }}
              >
                {matchScore}%
              </span>
            </p>
            {Array.isArray(missingWords) && missingWords.length > 0 && (
              <div style={{ marginTop: "1rem" }}>
                <strong>Missing Keywords (Consider adding):</strong>
                <ul>
                  {missingWords.map((word, i) => (
                    <li key={i}>{word}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Analyzer;
