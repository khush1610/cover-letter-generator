import React from "react";
import "./Footer.css"; // or include in App.css

function Footer() {
  return (
    <footer className="app-footer">
      © {new Date().getFullYear()} Khushi Mandal. All rights reserved.
    </footer>
  );
}

export default Footer;
