import React, { useContext, useState } from "react";
import axios from "axios";
import { SharedContext } from "../components/SharedContext";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Generator() {
  const { resumeText, setResumeText, jobDescription, setJobDescription } =
    useContext(SharedContext);
  const [coverLetter, setCoverLetter] = useState("");
  const [tone, setTone] = useState("Professional");
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // ⬅️ Add error state

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const res = await axios.post(`${API_BASE}/upload`, formData);

      setResumeText(res.data.resumeText);
      setErrorMessage("");
    } catch (err) {
      setErrorMessage("Failed to extract resume. Please try again.");
    }
  };

  const handleGenerate = async () => {
    try {
      setErrorMessage(""); // clear old error
      setCoverLetter("");

      const res = await axios.post("${API_BASE}/generate", {
        resumeText,
        jobDescription,
        tone,
        feedback,
      });

      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setErrorMessage(
          "You’ve reached your usage limit. Please try again later."
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="section">
      <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>
        Cover Letter Generator
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ fontWeight: 500 }}>Upload Resume (PDF):</label>
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
            rows="8"
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

        <div>
          <label style={{ fontWeight: 500 }}>Select Tone:</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          >
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Confident">Confident</option>
            <option value="Formal">Formal</option>
            <option value="Creative">Creative</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 500 }}>Feedback (optional):</label>
          <input
            type="text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add custom instructions or preferences..."
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.75rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
        </div>

        <button onClick={handleGenerate} style={{ width: "fit-content" }}>
          Generate Cover Letter
        </button>

        {/* Error message block */}
        {errorMessage && (
          <div
            style={{
              color: "#b00020",
              backgroundColor: "#ffe6e6",
              padding: "1rem",
              border: "1px solid #f5c2c2",
              borderRadius: "6px",
            }}
          >
            {errorMessage}
          </div>
        )}

        {coverLetter && (
          <div style={{ marginTop: "2rem" }}>
            <h3>Generated Cover Letter</h3>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                backgroundColor: "#fdfdfd",
                padding: "1rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                lineHeight: 1.6,
                fontFamily: "inherit",
              }}
            >
              {coverLetter}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default Generator;
