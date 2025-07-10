
// src/components/SharedContext.js
import React, { createContext, useState } from "react";

export const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  return (
    <SharedContext.Provider value={{
      resumeText,
      setResumeText,
      jobDescription,
      setJobDescription,
    }}>
      {children}
    </SharedContext.Provider>
  );
};

