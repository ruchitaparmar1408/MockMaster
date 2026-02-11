import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const backgroundUrl =
  "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1600";

const suggestRoleFromSkills = (skills, roles) => {
  if (!skills.length) return "";
  const text = skills.join(" ").toLowerCase();
  if (text.includes("react") || text.includes("frontend") || text.includes("css"))
    return "Frontend Developer";
  if (text.includes("node") || text.includes("express") || text.includes("api"))
    return "Backend Developer";
  if (text.includes("ml") || text.includes("machine") || text.includes("data"))
    return "Machine Learning Engineer";
  if (text.includes("figma") || text.includes("ui") || text.includes("design"))
    return "UI/UX Engineer";
  if (text.includes("cloud") || text.includes("aws") || text.includes("docker") || text.includes("kubernetes"))
    return "DevOps / Cloud Engineer";
  return roles[0] || "";
};

const DashboardPage = () => {
  const {
    aptitudeCategories,
    selectedCategories,
    setSelectedCategories,
    engineeringDomains,
    selectedEngineering,
    setSelectedEngineering,
    roles,
    positions,
    selectedRole,
    setSelectedRole,
    selectedPosition,
    setSelectedPosition,
    skills,
    setSkills,
    questionCount,
    setQuestionCount,
    interviewMode,
    setInterviewMode,
    generateQuestions,
  } = useAppContext();

  const [skillsInput, setSkillsInput] = useState(skills.join(", "));
  const [autoSuggestedRole, setAutoSuggestedRole] = useState("");
  const [resumeInfo, setResumeInfo] = useState(null);
  const navigate = useNavigate();

  const canStart = selectedRole && selectedPosition && questionCount > 0;

  const userProfileSummary = useMemo(
    () => ({
      headline: selectedRole || "Choose a role to begin",
      sub: selectedPosition
        ? `${selectedPosition} • ${questionCount} question session`
        : "Pick your focus – study, internship, or job",
      chip: skills.length ? `${skills.length} skills mapped` : "No skills added yet",
    }),
    [selectedRole, selectedPosition, questionCount, skills.length],
  );

  const handleSkillsBlur = () => {
    const parsed = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setSkills(parsed);
    const suggestion = suggestRoleFromSkills(parsed, roles);
    setAutoSuggestedRole(suggestion);
    if (!selectedRole && suggestion) setSelectedRole(suggestion);
  };

  const handleStart = () => {
    generateQuestions(questionCount);
    navigate("/test");
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleResumeChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const info = {
      name: file.name,
      sizeKb: Math.round(file.size / 1024),
    };
    setResumeInfo(info);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "").toLowerCase();
        if (!text) return;
        const knownSkills = [
          "react",
          "javascript",
          "typescript",
          "html",
          "css",
          "node",
          "express",
          "python",
          "java",
          "c++",
          "data structures",
          "algorithms",
          "sql",
          "mongodb",
          "docker",
          "kubernetes",
          "aws",
          "azure",
          "git",
          "machine learning",
          "deep learning",
          "pandas",
          "numpy",
          "matlab",
          "cad",
          "solidworks",
          "ansys",
          "autocad",
        ];
        const inferred = knownSkills.filter((skill) => text.includes(skill));
        if (!inferred.length) return;

        const combined = Array.from(
          new Set([...(skills || []), ...inferred.map((s) => s.replace(/\b\w/g, (m) => m.toUpperCase()))]),
        );
        setSkills(combined);
        setSkillsInput(combined.join(", "));
        const suggestion = suggestRoleFromSkills(combined, roles);
        if (suggestion) {
          setAutoSuggestedRole(suggestion);
          if (!selectedRole) setSelectedRole(suggestion);
        }
        setResumeInfo({
          ...info,
          inferredCount: inferred.length,
        });
      };
      reader.readAsText(file);
    } catch {
      // If reading fails (e.g. binary PDF), we still keep basic resume info
      setResumeInfo(info);
    }
  };

  return (
    <div
      className="page-shell with-hero"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.9), rgba(8,47,73,0.85)), url(${backgroundUrl})`,
      }}
    >
      <section className="dashboard-hero">
        <div>
          <h1>
            Design your <span className="accent">interview track</span>
          </h1>
          <p>
            Select your engineering stream, role, focus, and skills. MockMaster will craft
            an AI‑driven interview session tuned exactly for you.
          </p>
          <div className="profile-summary">
            <div>
              <h3>{userProfileSummary.headline}</h3>
              <p>{userProfileSummary.sub}</p>
            </div>
            <span className="chip">{userProfileSummary.chip}</span>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <h2>1. Choose your engineering stream</h2>
          <p className="muted">
            Start by telling MockMaster which branch of engineering you&apos;re aiming for.
          </p>
          <div className="pill-grid">
            {engineeringDomains.map((domain) => (
              <button
                key={domain}
                type="button"
                className={`pill ${selectedEngineering === domain ? "active" : ""}`}
                onClick={() => {
                  setSelectedEngineering(domain);
                  if (roles.length) {
                    setSelectedRole("");
                  }
                }}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {selectedEngineering === "Aptitude / General" && (
          <div className="card">
            <h2>2. Choose aptitude sections</h2>
            <p className="muted">
              Focus the mock interview on the sections you want to strengthen: reasoning,
              quantitative aptitude, behavioural, and more.
            </p>
            <div className="pill-grid">
              {aptitudeCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`pill ${
                    selectedCategories.includes(cat) ? "active" : ""
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <p className="hint">
              Leave empty to get a balanced aptitude mix, or select specific sections for
              targeted practice.
            </p>
          </div>
        )}

        <div className="card">
          <h2>{selectedEngineering === "Aptitude / General" ? "3. Choose your role" : "2. Choose your role"}</h2>
          <p className="muted">
            Now pick the specific kind of engineer or role you want to prepare for.
          </p>
          <div className="pill-grid">
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                className={`pill ${selectedRole === role ? "active" : ""}`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
          {autoSuggestedRole && (
            <p className="hint">
              Based on your skills we think you shine as{" "}
              <strong>{autoSuggestedRole}</strong>.
            </p>
          )}
        </div>

        <div className="card">
          <h2>3. Pick your position type & style</h2>
          <p className="muted">
            Tune difficulty and choose whether you want a classic MCQ test or a face‑to‑face
            style interview where you answer by speaking.
          </p>
          <div className="pill-grid">
            {positions.map((p) => (
              <button
                key={p}
                type="button"
                className={`pill ${selectedPosition === p ? "active" : ""}`}
                onClick={() => setSelectedPosition(p)}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="field-inline">
            <label>
              Questions in this session
              <input
                type="number"
                min={5}
                max={20}
                step={1}
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(
                    Math.max(1, Math.min(20, Number(e.target.value) || 0)),
                  )
                }
              />
            </label>
            <span className="muted small">Recommended: 10‑15 for focused practice.</span>
          </div>
          <div className="field-inline" style={{ marginTop: "0.8rem" }}>
            <span className="muted small">Interview structure</span>
            <div className="pill-grid">
              <button
                type="button"
                className={`pill ${interviewMode === "standard" ? "active" : ""}`}
                onClick={() => setInterviewMode("standard")}
              >
                Classic (MCQ‑focused)
              </button>
              <button
                type="button"
                className={`pill ${interviewMode === "face-to-face" ? "active" : ""}`}
                onClick={() => setInterviewMode("face-to-face")}
              >
                Face‑to‑face (voice & camera)
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>4. Map your skills</h2>
          <p className="muted">
            Tell MockMaster what you already know so we can judge the right level.
          </p>
          <label>
            Skills (comma separated)
            <textarea
              rows={4}
              placeholder="e.g. React, JavaScript, HTML, CSS, Data Structures, Git..."
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              onBlur={handleSkillsBlur}
            />
          </label>
          <div className="field-inline" style={{ marginTop: "0.9rem" }}>
            <label>
              Attach your resume (optional)
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="file-input"
                onChange={handleResumeChange}
              />
            </label>
            <span className="muted small">
              The file stays in your browser only. MockMaster will scan it for skills to better
              suggest a role.
            </span>
            {resumeInfo && (
              <p className="hint small">
                Using <strong>{resumeInfo.name}</strong> ({resumeInfo.sizeKb} KB)
                {typeof resumeInfo.inferredCount === "number"
                  ? ` • detected ${resumeInfo.inferredCount} known skills.`
                  : "."}
              </p>
            )}
          </div>
        </div>

        <div className="card emphasis">
          <h2>Ready to be interviewed?</h2>
          <p>
            Our AI voice interviewer will ask you real‑world questions. Answer at your
            own pace, see your score instantly, and get a roadmap tailored to your
            timeline.
          </p>
          <button
            type="button"
            className="btn-primary large"
            disabled={!canStart}
            onClick={handleStart}
          >
            Launch AI Interview
          </button>
          {!canStart && (
            <p className="hint">Pick a role, position, and question count to begin.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;

