import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import HistoryPage from "./pages/HistoryPage";
import ProgressPage from "./pages/ProgressPage";
import Navbar from "./components/Navbar";
import { AppContextProvider } from "./context/AppContext";

const AppShell = () => {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Prefer MockMaster key but migrate old RoleForge key if present
    const mmUser = localStorage.getItem("mm_user");
    const legacyUser = localStorage.getItem("rf_user");
    if (mmUser || legacyUser) {
      if (!mmUser && legacyUser) {
        localStorage.setItem("mm_user", legacyUser);
        localStorage.removeItem("rf_user");
      }
      setIsAuthed(true);
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("mm_user");
    localStorage.removeItem("rf_user");
    setIsAuthed(false);
    navigate("/auth");
  };

  return (
    <div className="app-root">
      <Navbar isAuthed={isAuthed} onSignOut={handleSignOut} />
      <Routes>
        <Route
          path="/auth"
          element={(
            <AuthPage
              onAuthSuccess={() => {
                setIsAuthed(true);
                navigate("/dashboard");
              }}
            />
          )}
        />
        <Route
          path="/dashboard"
          element={isAuthed ? <DashboardPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/test"
          element={isAuthed ? <TestPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/results"
          element={isAuthed ? <ResultsPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/history"
          element={isAuthed ? <HistoryPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/progress"
          element={isAuthed ? <ProgressPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/"
          element={<Navigate to={isAuthed ? "/dashboard" : "/auth"} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <AppContextProvider>
    <AppShell />
  </AppContextProvider>
);

export default App;

