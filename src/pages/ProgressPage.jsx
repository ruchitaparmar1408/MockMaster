import React, { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

const backgroundUrl =
  "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600";

const ProgressPage = () => {
  const { history } = useAppContext();

  const stats = useMemo(() => {
    if (!history.length) {
      return {
        totalAttempts: 0,
        totalQuestions: 0,
        averageScore: 0,
        bestScore: 0,
        byEngineering: {},
      };
    }

    const totalAttempts = history.length;
    let totalQuestions = 0;
    let scoreSum = 0;
    let bestScore = 0;
    const byEngineering = {};

    history.forEach((attempt) => {
      totalQuestions += attempt.total || 0;
      scoreSum += attempt.scorePercent || 0;
      bestScore = Math.max(bestScore, attempt.scorePercent || 0);
      const key = attempt.engineering || "General";
      if (!byEngineering[key]) {
        byEngineering[key] = { count: 0, avg: 0 };
      }
      byEngineering[key].count += 1;
      byEngineering[key].avg += attempt.scorePercent || 0;
    });

    Object.keys(byEngineering).forEach((k) => {
      byEngineering[k].avg = Math.round(byEngineering[k].avg / byEngineering[k].count);
    });

    const averageScore = Math.round(scoreSum / totalAttempts);

    return {
      totalAttempts,
      totalQuestions,
      averageScore,
      bestScore,
      byEngineering,
    };
  }, [history]);

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.9)), url(${backgroundUrl})`,
      }}
    >
      <section className="results-layout">
        <main className="results-main glass">
          <header className="results-header">
            <div>
              <h1>Your progress overview</h1>
              <p className="muted">
                See how your interview performance is evolving across engineering streams,
                aptitude and roles.
              </p>
            </div>
          </header>

          {!history.length && (
            <p className="muted" style={{ marginTop: "1rem" }}>
              You don&apos;t have any completed mock interviews yet. Take your first
              session from the dashboard to start tracking progress.
            </p>
          )}

          {history.length > 0 && (
            <section className="results-grid">
              <div className="card">
                <h2>Key stats</h2>
                <div className="stat-strip">
                  <div>
                    <span className="muted small">Total attempts</span>
                    <strong>{stats.totalAttempts}</strong>
                  </div>
                  <div>
                    <span className="muted small">Questions answered</span>
                    <strong>{stats.totalQuestions}</strong>
                  </div>
                  <div>
                    <span className="muted small">Average score</span>
                    <strong>{stats.averageScore}%</strong>
                  </div>
                  <div>
                    <span className="muted small">Best score</span>
                    <strong>{stats.bestScore}%</strong>
                  </div>
                </div>

                <h3 style={{ marginTop: "1rem" }}>Latest attempts</h3>
                <ul className="tiny" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {history.slice(0, 5).map((attempt) => (
                    <li key={attempt.timestamp} style={{ marginBottom: "0.35rem" }}>
                      <strong>{attempt.role || "Custom role"}</strong>{" "}
                      <span className="muted small">
                        in {attempt.engineering || "General"} • {attempt.position}
                      </span>{" "}
                      <span className="badge subtle small">
                        {attempt.scorePercent}% ({attempt.correct}/{attempt.total})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h2>Progress by engineering stream</h2>
                <p className="muted small">
                  Each bar shows how many sessions you&apos;ve taken in a stream, and the
                  average score there.
                </p>
                <div className="progress-streams">
                  {Object.entries(stats.byEngineering).map(([name, info]) => (
                    <div key={name} className="progress-stream-row">
                      <div className="progress-stream-label">
                        <span>{name}</span>
                        <span className="muted tiny">
                          {info.count} attempt{info.count > 1 ? "s" : ""} • avg {info.avg}%
                        </span>
                      </div>
                      <div className="progress-bar-track">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${info.avg}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </section>
    </div>
  );
};

export default ProgressPage;

