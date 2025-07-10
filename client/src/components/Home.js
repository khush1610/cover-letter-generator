import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Job Application Toolkit</h1>
        <p>Build better job applications — faster.</p>
        <div className="hero-buttons">
          <Link to="/generator" className="btn-outline">Cover Letter Generator</Link>
          <Link to="/analyzer" className="btn-outline">Resume Analyzer</Link>
          <Link to="/ats-checker" className="btn-outline">ATS Checker</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>🔍 Keyword Matching</h3>
          <p>See how well your resume matches the job description using smart word analysis.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Tailored Cover Letters</h3>
          <p>Generate clean, job-specific cover letters with just one click.</p>
        </div>
        <div className="feature-card">
          <h3>✅ ATS Optimization</h3>
          <p>Check formatting, structure, and content compatibility with applicant tracking systems.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
