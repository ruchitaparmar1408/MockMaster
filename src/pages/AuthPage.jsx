import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const backgroundUrl =
  "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1600";

const AuthPage = ({ onAuthSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadUsers = () => {
    try {
      const raw = localStorage.getItem("mm_users");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("mm_users", JSON.stringify(users));
  };

  const handleForgotPassword = () => {
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError("Enter the email of the account you want to clear.");
      return;
    }
    const users = loadUsers();
    const existing = users.find((u) => u.email === trimmedEmail);
    if (!existing) {
      setError("No account found with this email.");
      return;
    }
    const remaining = users.filter((u) => u.email !== trimmedEmail);
    saveUsers(remaining);
    const current = localStorage.getItem("mm_user");
    if (current) {
      try {
        const parsed = JSON.parse(current);
        if (parsed.email === trimmedEmail) {
          localStorage.removeItem("mm_user");
        }
      } catch {
        // ignore parse error
      }
    }
    setPassword("");
    setConfirmPassword("");
    setError("Account cleared. You can sign up again with this email.");
    setMode("signup");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (!password) {
        setError("Please choose a password.");
        return;
      }
      if (password.length < 6) {
        setError("Password should be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      const users = loadUsers();
      const existing = users.find((u) => u.email === trimmedEmail);
      if (existing) {
        setError("An account with this email already exists. Please sign in.");
        return;
      }

      const newUser = {
        name: name.trim(),
        email: trimmedEmail,
        password,
      };
      saveUsers([...users, newUser]);
      localStorage.setItem("mm_user", JSON.stringify(newUser));
      onAuthSuccess();
      navigate("/dashboard");
    } else {
      if (!password) {
        setError("Please enter your password.");
        return;
      }
      const users = loadUsers();
      const existing = users.find((u) => u.email === trimmedEmail);
      if (!existing || existing.password !== password) {
        setError("Invalid email or password.");
        return;
      }
      localStorage.setItem("mm_user", JSON.stringify(existing));
      onAuthSuccess();
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.8), rgba(30,64,175,0.7)), url(${backgroundUrl})`,
      }}
    >
      <div className="auth-card glass">
        <div className="auth-header">
          <h1>{mode === "signin" ? "Welcome back" : "Create your space"}</h1>
          <p>
            Craft your personalised interview journey with{" "}
            <span className="accent">MockMaster</span>.
          </p>
        </div>
        <div className="auth-toggle">
          <button
            type="button"
            className={mode === "signin" ? "active" : ""}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <label>
              Name
              <input
                type="text"
                placeholder="Alex Interviewer"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={mode === "signin" ? "Your password" : "At least 6 characters"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          {mode === "signup" && (
            <label>
              Confirm password
              <div className="password-row">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </label>
          )}
          <button type="submit" className="btn-primary">
            {mode === "signin" ? "Enter Dashboard" : "Create Account"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              className="link-button"
              onClick={handleForgotPassword}
            >
              Forgot password? Clear this account
            </button>
          )}
          {error && <p className="auth-footnote" style={{ color: "#fca5a5" }}>{error}</p>}
          {!error && (
            <p className="auth-footnote">
              Accounts are stored securely in your browser only – perfect for practice.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;

