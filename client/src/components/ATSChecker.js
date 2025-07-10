import React, { useContext, useState } from "react";
import axios from "axios";
import { SharedContext } from "../components/SharedContext";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ATSChecker() {
  const { resumeText, setResumeText } = useContext(SharedContext);
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState(null);
  const [issues, setIssues] = useState([]);

  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await axios.post("/upload", formData);
    setResumeText(res.data.resumeText);
  };

  const handleCheck = async () => {
    const res = await axios.post(`${API_BASE}/ats-check`, {
      resumeText,
      jobDescription,
    });
    setAtsScore(res.data.score);
    setIssues(res.data.issues);
  };

  return (
    <div className="section">
      <h2 style={{ marginBottom: "1rem", fontWeight: 600 }}>Resume ATS Checker</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Upload Resume */}
        <div>
          <label style={{ fontWeight: 500 }}>Upload Resume (PDF):</label>
          <input type="file" accept=".pdf" onChange={handleUpload} style={{ marginTop: "0.5rem" }} />
        </div>

        {/* Paste JD */}
        <div>
          <label style={{ fontWeight: 500 }}>Paste Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            style={{ marginTop: "0.5rem", width: "100%", maxWidth: "600px", padding: "0.75rem" }}
            placeholder="Paste the job description here..."
          />
        </div>

        {/* Button */}
        <button onClick={handleCheck} style={{ width: "fit-content" }}>
          Run ATS Check
        </button>

        {/* Results */}
        {atsScore !== null && (
          <div style={{ marginTop: "2rem" }}>
            <h3>
              ATS Score:{" "}
              <span style={{ color: atsScore > 70 ? "green" : "red" }}>
                {atsScore}%
              </span>
            </h3>

            {issues.length > 0 && (
              <>
                <h4 style={{ marginTop: "1rem" }}>Detected Issues:</h4>
                <ul style={{ paddingLeft: "1.5rem", lineHeight: 1.6 }}>
                  {issues.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSChecker;
