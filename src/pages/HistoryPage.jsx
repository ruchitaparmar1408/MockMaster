import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const backgroundUrl =
  "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1600";

const HistoryPage = () => {
  const { history } = useAppContext();
  const navigate = useNavigate();

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.9)), url(${backgroundUrl})`,
      }}
    >
      <section className="history-layout glass">
        <header className="history-header">
          <div>
            <h1>Past Interview Sessions</h1>
            <p className="muted">
              Track how you&apos;re improving over time. Each card is a snapshot of one
              AI interview.
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            New interview
          </button>
        </header>

        {history.length === 0 && (
          <p className="muted">
            You haven&apos;t completed any sessions yet. Start your first one from the
            dashboard.
          </p>
        )}

        <div className="history-grid">
          {history.map((attempt, idx) => (
            <article key={attempt.timestamp} className="history-card">
              <header>
                <div>
                  <h2>
                    {attempt.role || "Custom role"} •{" "}
                    <span className="muted small">{attempt.position}</span>
                  </h2>
                  <p className="muted tiny">
                    {new Date(attempt.timestamp).toLocaleString()} •{" "}
                    {attempt.questionCount} questions
                  </p>
                </div>
                <div className="mini-score">
                  <span>{attempt.scorePercent}</span>
                  <span className="tiny">%</span>
                </div>
              </header>
              <div className="history-body">
                <p className="muted tiny">
                  Level: <strong>{attempt.level}</strong> • Correct:{" "}
                  <strong>
                    {attempt.correct}/{attempt.total}
                  </strong>
                </p>
                {attempt.skills?.length ? (
                  <p className="muted tiny">
                    Skills snapshot: {attempt.skills.slice(0, 5).join(", ")}
                    {attempt.skills.length > 5 ? "…" : ""}
                  </p>
                ) : null}
                {Object.keys(attempt.weakTopics || {}).length > 0 ? (
                  <p className="muted tiny">
                    Weak topics:{" "}
                    {Object.entries(attempt.weakTopics)
                      .map(([t, c]) => `${t} (${c})`)
                      .join(", ")}
                  </p>
                ) : (
                  <p className="muted tiny">No clear weaknesses detected in this set.</p>
                )}
              </div>
              <footer className="history-footer">
                <span className="badge subtle small">Attempt #{history.length - idx}</span>
              </footer>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HistoryPage;

