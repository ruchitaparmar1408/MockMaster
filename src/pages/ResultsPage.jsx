import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const backgroundUrl =
  "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1600";

const loadLastResult = () => {
  try {
    const raw = localStorage.getItem("rf_last_result");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const buildSummaryText = (result) => {
  if (!result) return "";
  const { engineering, role, position, scorePercent, level, weakTopics } = result;
  const topics = Object.keys(weakTopics || {});
  const weakSummary = topics.length
    ? `Your weaker areas were ${topics.join(", ")}.`
    : "You showed balanced strength across the topics asked.";
  const streamText = engineering ? ` in ${engineering}` : "";
  return `For the ${role || "selected"} role${streamText} at ${
    position || "your chosen"
  } level, you scored ${scorePercent}% and currently stand at ${level} level. ${weakSummary}`;
};

const engineeringRoadmapPresets = {
  "Computer / IT": {
    focus: ["DSA", "System Design", "Language & Frameworks"],
    phases: {
      Foundations:
        "Rebuild core CS foundations: data structures, algorithms, and language fundamentals for your chosen tech stack.",
      "Deep Practice":
        "Solve varied coding problems, build 1–2 focused projects that mirror your target role (frontend, backend, etc.).",
      Simulation:
        "Run mock interviews on platforms, system design discussions, and timed coding rounds close to company patterns.",
    },
  },
  "Mechanical Engineering": {
    focus: ["Mechanics of Materials", "Machine Design", "Thermal / HVAC"],
    phases: {
      Foundations:
        "Refresh strength of materials, theory of machines, and thermodynamics with numerical problems and past exam/company questions.",
      "Deep Practice":
        "Work on design calculations for shafts, beams, gear trains, plus 3D modelling exercises in CAD tools relevant to your role.",
      Simulation:
        "Prepare detailed case studies (e.g. a complete component or system) and walk through them verbally as in a design review.",
    },
  },
  "Civil Engineering": {
    focus: ["Structural Analysis", "Concrete & Steel Design", "Geotechnical / Foundations"],
    phases: {
      Foundations:
        "Revisit structural analysis basics, load combinations, and soil mechanics fundamentals with hand‑calculation practice.",
      "Deep Practice":
        "Design example beams, slabs, columns and foundations using relevant codes; practice quantity estimation and drawings.",
      Simulation:
        "Simulate site‑style interviews: explain design decisions, safety margins, and how you would handle real project constraints.",
    },
  },
  "Electrical Engineering": {
    focus: ["Circuits & Machines", "Power Systems", "Control / Protection"],
    phases: {
      Foundations:
        "Strengthen basic circuit theory, AC analysis, and machine principles with solved problems and derivations.",
      "Deep Practice":
        "Analyze power flow, fault levels, and protection schemes; solve numerical problems similar to utility / core company interviews.",
      Simulation:
        "Practice explaining single‑line diagrams and control strategies on a whiteboard as if in a panel technical round.",
    },
  },
  "Electronics & Communication": {
    focus: ["Signals & Systems", "Analog/Digital Electronics", "Communication Systems"],
    phases: {
      Foundations:
        "Revise signals, systems, and network theory with emphasis on frequency response, filters, and basic device characteristics.",
      "Deep Practice":
        "Design small circuits, work through modulation/demodulation problems, and timing/logic design examples.",
      Simulation:
        "Explain block diagrams of real‑world communication links or embedded systems as you would in an EC core interview.",
    },
  },
  "Chemical Engineering": {
    focus: ["Fluid Mechanics", "Heat & Mass Transfer", "Reaction Engineering"],
    phases: {
      Foundations:
        "Rebuild fundamentals: dimensionless numbers, basic reactor types, and transfer operations through numerical practice.",
      "Deep Practice":
        "Solve design and rating problems for exchangers, columns, and reactors similar to process design interview questions.",
      Simulation:
        "Walk through full process flowsheets and safety considerations for a plant‑style problem in mock interviews.",
    },
  },
};

const buildRoadmap = (result, horizon) => {
  if (!result) return [];
  const topics = Object.keys(result.weakTopics || {});
  const preset = engineeringRoadmapPresets[result.engineering] || engineeringRoadmapPresets["Computer / IT"];
  const focus = topics.length ? topics : preset.focus;

  const base = [
    {
      label: "Foundations",
      description:
        (preset.phases && preset.phases.Foundations) ||
        "Clarify fundamentals, fill blind spots, and ensure strong basics.",
    },
    {
      label: "Deep Practice",
      description:
        (preset.phases && preset.phases["Deep Practice"]) ||
        "Deliberate practice with targeted problems and mini‑projects.",
    },
    {
      label: "Simulation",
      description:
        (preset.phases && preset.phases.Simulation) ||
        "Timed mock interviews, whiteboarding, and system discussions.",
    },
  ];

  const weeks =
    horizon === "1m" ? 4 : horizon === "2m" ? 8 : horizon === "3m" ? 12 : 6;

  return base.map((phase, index) => {
    const startWeek = Math.floor((index * weeks) / base.length) + 1;
    const endWeek = Math.floor(((index + 1) * weeks) / base.length);
    return {
      ...phase,
      window: `Weeks ${startWeek}‑${endWeek}`,
      focus,
    };
  });
};

const ResultsPage = () => {
  const [result, setResult] = useState(null);
  const [horizon, setHorizon] = useState("1m");
  const navigate = useNavigate();

  useEffect(() => {
    const r = loadLastResult();
    if (!r) {
      navigate("/dashboard");
    } else {
      setResult(r);
    }
  }, [navigate]);

  const summaryText = useMemo(() => buildSummaryText(result), [result]);
  const roadmap = useMemo(() => buildRoadmap(result, horizon), [result, horizon]);

  if (!result) return null;

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(145deg, rgba(15,23,42,0.96), rgba(67,56,202,0.92)), url(${backgroundUrl})`,
      }}
    >
      <section className="results-layout">
        <main className="results-main glass">
          <header className="results-header">
            <div>
              <h1>Your Interview Snapshot</h1>
              <p>{summaryText}</p>
            </div>
            <div className="score-circle">
              <span>{result.scorePercent}</span>
              <span className="small">Score</span>
            </div>
          </header>

          <section className="results-grid">
            <div className="card">
              <h2>Performance breakdown</h2>
              <div className="stat-strip">
                <div>
                  <span className="muted small">Correct</span>
                  <strong>
                    {result.correct} / {result.total}
                  </strong>
                </div>
                <div>
                  <span className="muted small">Level</span>
                  <span className="badge">{result.level}</span>
                </div>
                <div>
                  <span className="muted small">Session type</span>
                  <span className="badge subtle">{result.position}</span>
                </div>
              </div>

              <h3>Question review</h3>
              <div className="question-review-list">
                {result.perQuestion.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`question-review-item ${
                      q.isCorrect ? "correct" : "incorrect"
                    }`}
                  >
                    <div className="question-review-header">
                      <span className="badge number small">{idx + 1}</span>
                      <span className="muted small">{q.topic}</span>
                      <span className="badge subtle small">{q.difficulty}</span>
                    </div>
                    <p className="question-text-small">{q.text}</p>
                    <ul className="options-list">
                      {q.options.map((opt, i) => (
                        <li key={opt}>
                          <span
                            className={`option-label ${
                              q.correctIndex === i ? "correct" : ""
                            } ${q.userIndex === i && q.correctIndex !== i ? "chosen" : ""}`}
                          >
                            {String.fromCharCode(65 + i)}.
                          </span>
                          <span>{opt}</span>
                          {q.correctIndex === i && <span className="tag">Correct</span>}
                          {q.userIndex === i && q.correctIndex !== i && (
                            <span className="tag error">Your answer</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2>Roadmap to level up</h2>
              <p className="muted">
                Pick how long you&apos;d like to commit, and follow the focused strategy.
              </p>
              <div className="pill-grid tight">
                <button
                  type="button"
                  className={`pill ${horizon === "1m" ? "active" : ""}`}
                  onClick={() => setHorizon("1m")}
                >
                  1 month sprint
                </button>
                <button
                  type="button"
                  className={`pill ${horizon === "2m" ? "active" : ""}`}
                  onClick={() => setHorizon("2m")}
                >
                  2 month build
                </button>
                <button
                  type="button"
                  className={`pill ${horizon === "3m" ? "active" : ""}`}
                  onClick={() => setHorizon("3m")}
                >
                  3 month mastery
                </button>
              </div>
              <div className="roadmap-list">
                {roadmap.map((phase) => (
                  <div key={phase.label} className="roadmap-item">
                    <div className="roadmap-header">
                      <span className="badge subtle small">{phase.window}</span>
                      <h3>{phase.label}</h3>
                    </div>
                    <p className="muted small">{phase.description}</p>
                    <p className="muted tiny">
                      Focus on: <strong>{phase.focus.join(", ")}</strong>
                    </p>
                    <ul className="tiny">
                      <li>
                        3–4 focused problem‑solving sessions per week on{" "}
                        {phase.focus[0] || "core concepts"}.
                      </li>
                      <li>
                        1 mini‑project or case study every {horizon === "1m" ? "week" : "2 weeks"}.
                      </li>
                      <li>1 simulated interview or timed quiz every weekend.</li>
                    </ul>
                  </div>
                ))}
              </div>

              <div className="results-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => navigate("/dashboard")}
                >
                  Retry with new settings
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => navigate("/history")}
                >
                  View attempt history
                </button>
              </div>
            </div>
          </section>
        </main>
      </section>
    </div>
  );
};

export default ResultsPage;

