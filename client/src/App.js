// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Analyzer from "./components/Analyzer";
import Generator from "./components/Generator";
import ATSChecker from "./components/ATSChecker";
import { SharedProvider } from "./components/SharedContext";
import Footer from "./components/Footer";
import Home from "./components/Home"; // ✅ add this
import "./App.css";

function App() {
  return (
    <SharedProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} /> {/* now loads homepage */}
              <Route path="/generator" element={<Generator />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/ats-checker" element={<ATSChecker />} />
            </Routes>

            <Footer />
          </div>
        </div>
      </Router>
    </SharedProvider>
  );
}

export default App;
