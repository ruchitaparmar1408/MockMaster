## MockMaster Interview Studio

A React + Vite single–page app for interactive interview preparation.

### Running locally

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the printed `http://localhost:5173` URL in your browser.

### Features

- Attractive **sign in / sign up** landing with glassmorphism and photography backgrounds.
- Guided **dashboard** where you choose:
  - Target interview **role** (frontend, backend, full‑stack, etc.).
  - Preparation **mode** (study, internship, job levels, etc.).
  - Desired **question count**.
  - Your current **skills**, which are used to auto‑suggest a suitable role.
- **AI voice interviewer** using the browser Speech Synthesis API that reads each question and its options aloud.
- 10+ curated **multiple‑choice questions** across CS, web, system design, ML, and DevOps.
- Instant **score, level assessment, and topic‑wise breakdown**, plus:
  - Clear view of **correct vs. selected answers**.
  - Interpretable level labels (Foundation → Interview‑Ready).
- Adaptive **roadmap generator**:
  - User picks **1 / 2 / 3 month** path.
  - App suggests focused phases with action items and topics to emphasise.
- Persistent **attempt history** stored in `localStorage` so users can track progress over time.

### Notes

- The AI voice interviewer relies on the browser`s built‑in `speechSynthesis` API. It is supported in most modern browsers on desktop; mobile support may vary.
- All data is kept in the browser (no backend / auth server); this is intentional for interview demo purposes.

