import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaHome, FaTimes, FaFileAlt, FaPenNib, FaChartLine } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: <FaHome /> },
    { path: "/analyzer", label: "Resume & JD Analyzer", icon: <FaFileAlt /> },
    { path: "/generator", label: "Cover Letter Generator", icon: <FaPenNib /> },
    { path: "/ats-checker", label: "ATS Checker", icon: <FaChartLine /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <FaBars /> : <FaTimes />}
      </button>
      <nav className="nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && <span className="label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;