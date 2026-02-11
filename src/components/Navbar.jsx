import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthed, onSignOut }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span className="brand-logo">MockMaster</span>
        <span className="brand-tagline">Interview Studio</span>
      </div>
      {isAuthed && (
        <nav className="navbar-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/test">AI Test</Link>
          <Link to="/history">Attempts</Link>
          <Link to="/progress">Progress</Link>
        </nav>
      )}
      <div className="navbar-right">
        {!isAuthPage && !isAuthed && <Link to="/auth">Sign In</Link>}
        {isAuthed && (
          <button type="button" className="btn-outline" onClick={onSignOut}>
            Sign Out
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

