import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useVoiceInterviewer } from "../hooks/useVoiceInterviewer";

const backgroundUrl =
  "https://images.pexels.com/photos/1181573/pexels-photo-1181573.jpeg?auto=compress&cs=tinysrgb&w=1600";

const TestPage = () => {
  const {
    currentQuestions,
    recordAnswer,
    recordSubjectiveAnswer,
    subjectiveAnswers,
    interviewMode,
    answers,
    computeResults,
    languages,
    selectedLanguage,
  } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const { enabled, isSpeaking, speak, toggleEnabled, stop } = useVoiceInterviewer();

  useEffect(() => {
    if (!currentQuestions.length) {
      navigate("/dashboard");
    }
  }, [currentQuestions.length, navigate]);

  useEffect(() => {
    if (interviewMode !== "face-to-face") return undefined;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return undefined;

    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (cancelled) return;
        streamRef.current = stream;
        if (videoRef.current) {
          // eslint-disable-next-line no-param-reassign
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        // ignore camera errors, UI will still work without preview
      });

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [interviewMode]);

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLanguage || "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const q = currentQuestions[activeIndex];
        if (q) {
          recordSubjectiveAnswer(q.id, transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }
  }, [activeIndex, currentQuestions, recordSubjectiveAnswer, selectedLanguage]);

  useEffect(() => {
    const q = currentQuestions[activeIndex];
    if (q && enabled) {
      speak(
        `Question ${activeIndex + 1}. ${q.text}. Your options are: ${q.options
          .map((o, i) => `Option ${i + 1}: ${o}`)
          .join(". ")}`,
        selectedLanguage,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, currentQuestions, enabled]);

  if (!currentQuestions.length) {
    return null;
  }

  const question = currentQuestions[activeIndex];
  const total = currentQuestions.length;
  const answeredCount = Object.keys(answers).length;

  const handleOptionClick = (index) => {
    recordAnswer(question.id, index);
  };

  const handleNext = () => {
    if (activeIndex < total - 1) {
      setActiveIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((i) => i - 1);
    }
  };

  const handleFinish = () => {
    const result = computeResults();
    stop();
    if (result) navigate("/results");
  };

  const isLast = activeIndex === total - 1;

  const handleStartVoiceAnswer = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleStopVoiceAnswer = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="page-shell"
      style={{
        backgroundImage: `linear-gradient(145deg, rgba(15,23,42,0.95), rgba(22,101,52,0.9)), url(${backgroundUrl})`,
      }}
    >
      <section className="test-layout">
        <aside className="test-sidebar glass">
          <h2>AI Voice Interview</h2>
          <p className="muted">
            Answer questions at your pace. Toggle AI voice if you prefer listening.
          </p>
          <div className="stat-row">
            <span>Question</span>
            <strong>
              {activeIndex + 1} / {total}
            </strong>
          </div>
          <div className="stat-row">
            <span>Answered</span>
            <strong>{answeredCount}</strong>
          </div>
          <div className="stat-row">
            <span>Voice</span>
            <button type="button" className="pill small" onClick={toggleEnabled}>
              {enabled ? "On" : "Off"}
            </button>
          </div>
          {interviewMode === "face-to-face" && (
            <>
              <div className="stat-row">
                <span>Mode</span>
                <strong style={{ fontSize: "0.8rem" }}>Face‑to‑face</strong>
              </div>
              <div className="camera-preview">
                <video ref={videoRef} autoPlay muted playsInline className="camera-video" />
                <span className="muted tiny">
                  Camera preview (stays on your device only – not uploaded anywhere).
                </span>
              </div>
            </>
          )}
          {enabled && (
            <p className="hint small">
              Your browser&apos;s speech engine reads each question aloud. Use the toggle
              anytime.
            </p>
          )}
          {isSpeaking && (
            <button type="button" className="btn-outline small" onClick={stop}>
              Stop Voice
            </button>
          )}
        </aside>

        <main className="test-main glass">
          <header className="test-header">
            <div>
              <span className="badge">{question.topic}</span>
              <span className="badge subtle">{question.difficulty}</span>
            </div>
          </header>

          <div className="question-text">
            <span className="badge number">{activeIndex + 1}</span>
            <p>{question.text}</p>
            {!question.options?.length && (
              <span className="badge subtle small" style={{ marginLeft: "0.75rem" }}>
                Speaking / subjective
              </span>
            )}
          </div>

          {question.options && question.options.length > 0 ? (
            <div className="options-grid">
              {question.options.map((opt, idx) => {
                const chosen = answers[question.id] === idx;
                return (
                  <button
                    key={opt}
                    type="button"
                    className={`option-card ${chosen ? "selected" : ""}`}
                    onClick={() => handleOptionClick(idx)}
                  >
                    <span className="option-index">{String.fromCharCode(65 + idx)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="subjective-answer">
              <label>
                Your answer (optional text backup)
                <textarea
                  rows={4}
                  placeholder="Speak your answer, or type key points here..."
                  value={subjectiveAnswers[question.id] || ""}
                  onChange={(e) => recordSubjectiveAnswer(question.id, e.target.value)}
                />
              </label>
              {interviewMode === "face-to-face" && voiceSupported && (
                <div className="subjective-controls">
                  <button
                    type="button"
                    className="btn-secondary small"
                    onClick={handleStartVoiceAnswer}
                    disabled={isListening}
                  >
                    {isListening ? "Listening..." : "Answer by speaking"}
                  </button>
                  {isListening && (
                    <button
                      type="button"
                      className="btn-outline small"
                      onClick={handleStopVoiceAnswer}
                    >
                      Stop listening
                    </button>
                  )}
                  {!voiceSupported && (
                    <p className="hint small">
                      Voice input is not supported in this browser. You can still answer out loud
                      for practice and optionally type notes.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <footer className="test-footer">
            <button
              type="button"
              className="btn-outline"
              disabled={activeIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </button>
            <div className="spacer" />
            {!isLast && (
              <button type="button" className="btn-secondary" onClick={handleNext}>
                Next
              </button>
            )}
            {isLast && (
              <button
                type="button"
                className="btn-primary"
                disabled={!answeredCount}
                onClick={handleFinish}
              >
                See My Score
              </button>
            )}
          </footer>
        </main>
      </section>
    </div>
  );
};

export default TestPage;

