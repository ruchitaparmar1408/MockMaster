import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const defaultRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full‑Stack Engineer",
  "Data Scientist",
  "Machine Learning Engineer",
  "DevOps / Cloud Engineer",
  "Mobile App Developer",
  "UI/UX Engineer",
  "Product Manager",
  "System Design Architect",
];

const engineeringTracks = {
  "Computer / IT": defaultRoles,
  "Aptitude / General": [
    "General Aptitude Practice",
    "Campus Placement Aptitude",
    "Government Exam Aptitude",
    "Behavioural Interview Prep",
  ],
  "Electronics & Communication": [
    "Embedded Systems Engineer",
    "VLSI / Chip Design Engineer",
    "Signal Processing Engineer",
    "Telecommunication Engineer",
    "IoT Systems Engineer",
  ],
  "Electrical Engineering": [
    "Power Systems Engineer",
    "Electrical Design Engineer",
    "Control Systems Engineer",
    "Instrumentation Engineer",
    "Renewable Energy Engineer",
  ],
  "Mechanical Engineering": [
    "Mechanical Design Engineer",
    "Automotive Engineer",
    "Thermal / HVAC Engineer",
    "Manufacturing / Production Engineer",
    "CAD / CAM Engineer",
  ],
  "Civil Engineering": [
    "Structural Design Engineer",
    "Site Engineer",
    "Transportation Engineer",
    "Geotechnical Engineer",
    "Construction Project Engineer",
  ],
  "Chemical Engineering": [
    "Process Design Engineer",
    "Plant Operations Engineer",
    "Safety & HAZOP Engineer",
    "Petrochemical Engineer",
  ],
  "Aerospace Engineering": [
    "Aerodynamics Engineer",
    "Flight Structures Engineer",
    "Avionics Engineer",
    "Propulsion Engineer",
  ],
  "Biotechnology": [
    "Bioprocess Engineer",
    "Research Associate (Bio)",
    "Quality Control Engineer (Bio / Pharma)",
  ],
  "Industrial / Production": [
    "Industrial Engineer",
    "Operations Excellence Engineer",
    "Supply Chain Analyst",
    "Quality / Reliability Engineer",
  ],
};

const defaultPositions = ["Study Practice", "Internship", "Entry‑Level Job", "Mid‑Level Job", "Senior Role"];

const aptitudeCategories = [
  "Behavioral",
  "Logical Reasoning",
  "Quantitative Aptitude",
  "Mathematics",
  "Verbal Ability",
  "Puzzles",
  "Data Interpretation",
];

const interviewLanguages = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "hi-IN", label: "Hindi (India)" },
  { code: "mr-IN", label: "Marathi (India)" },
  { code: "bn-IN", label: "Bengali (India)" },
  { code: "ta-IN", label: "Tamil (India)" },
  { code: "te-IN", label: "Telugu (India)" },
  { code: "kn-IN", label: "Kannada (India)" },
  { code: "ml-IN", label: "Malayalam (India)" },
  { code: "gu-IN", label: "Gujarati (India)" },
  { code: "pa-IN", label: "Punjabi (India)" },
  { code: "fr-FR", label: "French" },
  { code: "de-DE", label: "German" },
  { code: "es-ES", label: "Spanish" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "it-IT", label: "Italian" },
  { code: "ru-RU", label: "Russian" },
  { code: "ja-JP", label: "Japanese" },
  { code: "ko-KR", label: "Korean" },
  { code: "zh-CN", label: "Chinese (Mandarin)" },
  { code: "ar-SA", label: "Arabic" },
];

const questionBanksByEngineering = {
  "Computer / IT": [
    {
      id: 1,
      text: "Explain the difference between synchronous and asynchronous programming.",
      options: [
        "Synchronous blocks until a task completes; asynchronous allows other work while waiting.",
        "Asynchronous code is always faster than synchronous code.",
        "They are exactly the same in JavaScript.",
        "Synchronous code runs only in the browser; asynchronous only on the server.",
      ],
      correctIndex: 0,
      topic: "Core CS",
      difficulty: "Easy",
    },
    {
      id: 2,
      text: "What is the main purpose of React hooks such as useState and useEffect?",
      options: [
        "To render HTML on the server only.",
        "To manage state and side‑effects in functional components.",
        "To replace JavaScript with TypeScript.",
        "To make CSS styling easier.",
      ],
      correctIndex: 1,
      topic: "Frontend / React",
      difficulty: "Easy",
    },
    {
      id: 3,
      text: "In a RESTful API, which HTTP method is typically idempotent and used for retrieving data?",
      options: ["POST", "PUT", "GET", "PATCH"],
      correctIndex: 2,
      topic: "Backend / APIs",
      difficulty: "Easy",
    },
    {
      id: 4,
      text: "What does Big‑O notation describe?",
      options: [
        "The exact runtime in milliseconds.",
        "The relative growth of an algorithm’s time or space usage.",
        "The amount of memory physically installed in a server.",
        "The number of bugs in your program.",
      ],
      correctIndex: 1,
      topic: "DSA",
      difficulty: "Medium",
    },
    {
      id: 5,
      text: "Which data structure is best suited for implementing a FIFO queue?",
      options: ["Stack", "Linked List or Array", "Hash Map", "Binary Search Tree"],
      correctIndex: 1,
      topic: "DSA",
      difficulty: "Easy",
    },
    {
      id: 6,
      text: "Which SQL command is used to remove all rows from a table but keep its structure?",
      options: ["DELETE", "DROP", "TRUNCATE", "ALTER"],
      correctIndex: 2,
      topic: "Databases",
      difficulty: "Medium",
    },
    {
      id: 7,
      text: "What is CI/CD mainly used for?",
      options: [
        "Continuous improvement of hardware only.",
        "Continuous integration and delivery/deployment of software.",
        "Cryptographic identity / certificate distribution.",
        "Client‑side image compression / decoding.",
      ],
      correctIndex: 1,
      topic: "DevOps",
      difficulty: "Easy",
    },
    {
      id: 8,
      text: "In machine learning, what is overfitting?",
      options: [
        "When the model is too small to learn anything.",
        "When the model performs well on training data but poorly on unseen data.",
        "When the dataset has too few features.",
        "When the learning rate is set to zero.",
      ],
      correctIndex: 1,
      topic: "ML",
      difficulty: "Medium",
    },
    {
      id: 9,
      text: "What does responsive web design aim to achieve?",
      options: [
        "Websites that only work on desktop.",
        "Websites that respond with JSON instead of HTML.",
        "Layouts that adapt to different screen sizes and devices.",
        "Faster database queries.",
      ],
      correctIndex: 2,
      topic: "UI/UX",
      difficulty: "Easy",
    },
    {
      id: 10,
      text: "Which of the following best describes a microservices architecture?",
      options: [
        "A single monolithic codebase for all features.",
        "An application composed of small, independently deployable services.",
        "A UI‑only architecture without backend services.",
        "A database‑less application.",
      ],
      correctIndex: 1,
      topic: "System Design",
      difficulty: "Medium",
    },
    {
      id: 11,
      text: "Subjective: Describe a recent project where you designed or significantly improved a system. What trade‑offs did you make?",
      options: [],
      correctIndex: 0,
      topic: "System Design",
      difficulty: "Medium",
    },
  ],
  "Aptitude / General": [
    {
      id: 101,
      text: "Aptitude: If a train travels at 60 km/h for 45 minutes, what distance does it cover?",
      options: ["30 km", "45 km", "60 km", "15 km"],
      correctIndex: 0,
      topic: "Quantitative",
      difficulty: "Easy",
      category: "Quantitative Aptitude",
    },
    {
      id: 102,
      text: "Aptitude: What is 35% of 200?",
      options: ["35", "40", "65", "70"],
      correctIndex: 3,
      topic: "Percentages",
      difficulty: "Easy",
      category: "Quantitative Aptitude",
    },
    {
      id: 103,
      text: "Reasoning: Find the next term in the series 2, 6, 12, 20, ?",
      options: ["30", "28", "26", "32"],
      correctIndex: 1,
      topic: "Number Series",
      difficulty: "Medium",
      category: "Logical Reasoning",
    },
    {
      id: 104,
      text: "Reasoning: If 'EARTH' is coded as 'FSUIJ', how is 'MOON' coded?",
      options: ["NPPO", "NPPQ", "NPPQ", "NPPM"],
      correctIndex: 1,
      topic: "Coding-Decoding",
      difficulty: "Medium",
      category: "Logical Reasoning",
    },
    {
      id: 105,
      text: "Behavioural: In a conflict with a teammate, what is the most professional first step?",
      options: [
        "Escalate immediately to your manager",
        "Stop working with the teammate",
        "Calmly discuss the issue with the teammate in private",
        "Send an angry email copying the entire team",
      ],
      correctIndex: 2,
      topic: "Behavioral",
      difficulty: "Easy",
      category: "Behavioral",
    },
    {
      id: 106,
      text: "Behavioural: When you receive critical feedback, what is the best way to respond?",
      options: [
        "Defend yourself strongly so they stop criticizing",
        "Listen carefully, ask clarifying questions, and create an improvement plan",
        "Ignore the feedback",
        "Blame other teammates",
      ],
      correctIndex: 1,
      topic: "Behavioral",
      difficulty: "Easy",
      category: "Behavioral",
    },
    {
      id: 107,
      text: "Maths: If (x + 2)^2 = 36, which of the following is a possible value of x?",
      options: ["4", "6", "-8", "10"],
      correctIndex: 0,
      topic: "Algebra",
      difficulty: "Easy",
      category: "Mathematics",
    },
    {
      id: 108,
      text: "Data Interpretation: A student scored 60, 70, 80 in three tests. What average is needed in the fourth test to reach an overall average of 75?",
      options: ["75", "80", "85", "90"],
      correctIndex: 1,
      topic: "Averages",
      difficulty: "Medium",
      category: "Data Interpretation",
    },
    {
      id: 109,
      text: "Verbal: Choose the option that best replaces the underlined phrase: She completed the work **in a jiffy**.",
      options: ["very slowly", "very quickly", "with many errors", "without interest"],
      correctIndex: 1,
      topic: "Idioms",
      difficulty: "Easy",
      category: "Verbal Ability",
    },
    {
      id: 110,
      text: "Subjective: Tell me about a time you solved a difficult logical or quantitative problem. How did you break it down?",
      options: [],
      correctIndex: 0,
      topic: "Behavioral",
      difficulty: "Medium",
      category: "Behavioral",
    },
  ],
  "Mechanical Engineering": [
    {
      id: 201,
      text: "Which law is primarily used to relate stress and strain in linear elastic materials?",
      options: ["Hooke's Law", "Bernoulli's Principle", "Pascal's Law", "Fourier's Law"],
      correctIndex: 0,
      topic: "Mechanics of Materials",
      difficulty: "Easy",
    },
    {
      id: 202,
      text: "For a simply supported beam under uniformly distributed load, where does maximum bending moment occur?",
      options: ["At the supports", "At the mid‑span", "At quarter span", "It is constant throughout"],
      correctIndex: 1,
      topic: "Machine Design",
      difficulty: "Medium",
    },
    {
      id: 203,
      text: "Which thermodynamic cycle most closely represents an ideal spark‑ignition petrol engine?",
      options: ["Otto cycle", "Diesel cycle", "Rankine cycle", "Brayton cycle"],
      correctIndex: 0,
      topic: "Thermodynamics",
      difficulty: "Easy",
    },
    {
      id: 204,
      text: "In a stress‑strain curve, the point beyond which permanent deformation begins is called:",
      options: ["Ultimate point", "Yield point", "Breaking point", "Elastic limit"],
      correctIndex: 1,
      topic: "Mechanics of Materials",
      difficulty: "Easy",
    },
    {
      id: 205,
      text: "Which of the following is commonly used as a CAD tool in mechanical design?",
      options: ["MATLAB", "AutoCAD / SolidWorks", "Wireshark", "Postman"],
      correctIndex: 1,
      topic: "CAD / Design Tools",
      difficulty: "Easy",
    },
    {
      id: 206,
      text: "The ratio of actual COP to ideal COP of a refrigeration system is called:",
      options: [
        "Refrigeration effect",
        "Coefficient of evaporation",
        "Relative COP",
        "Isentropic efficiency",
      ],
      correctIndex: 2,
      topic: "Refrigeration & AC",
      difficulty: "Medium",
    },
    {
      id: 207,
      text: "Subjective: Explain a mechanical design or analysis project you worked on and the key engineering decisions you made.",
      options: [],
      correctIndex: 0,
      topic: "Design Experience",
      difficulty: "Medium",
    },
  ],
  "Civil Engineering": [
    {
      id: 301,
      text: "Which test is primarily used to determine the compressive strength of concrete?",
      options: [
        "Slump test",
        "Cube compression test",
        "Atterberg limits test",
        "Proctor compaction test",
      ],
      correctIndex: 1,
      topic: "Concrete Technology",
      difficulty: "Easy",
    },
    {
      id: 302,
      text: "In a simply supported beam, positive bending moment causes the beam to:",
      options: ["SAG (smile)", "HOG (frown)", "Remain straight", "Twist"],
      correctIndex: 0,
      topic: "Structural Analysis",
      difficulty: "Easy",
    },
    {
      id: 303,
      text: "Which type of foundation is generally preferred for weak soils at shallow depth?",
      options: ["Isolated footing", "Raft foundation", "Pile foundation", "Strip footing"],
      correctIndex: 1,
      topic: "Foundation Engineering",
      difficulty: "Medium",
    },
    {
      id: 304,
      text: "The primary purpose of reinforcement in reinforced concrete is to:",
      options: [
        "Resist compressive stresses only",
        "Resist tensile stresses",
        "Increase weight of structure",
        "Improve aesthetics",
      ],
      correctIndex: 1,
      topic: "Concrete Technology",
      difficulty: "Easy",
    },
    {
      id: 305,
      text: "Which instrument is commonly used for precise angle measurement in surveying?",
      options: ["Planimeter", "Theodolite", "Piezometer", "Anemometer"],
      correctIndex: 1,
      topic: "Surveying",
      difficulty: "Easy",
    },
    {
      id: 306,
      text: "Subjective: Describe a civil or structural project you have studied or worked on and how you ensured safety and serviceability.",
      options: [],
      correctIndex: 0,
      topic: "Project Experience",
      difficulty: "Medium",
    },
  ],
  "Electrical Engineering": [
    {
      id: 401,
      text: "Ohm's law relates which three quantities?",
      options: [
        "Voltage, current, resistance",
        "Power, energy, time",
        "Voltage, power, frequency",
        "Current, inductance, capacitance",
      ],
      correctIndex: 0,
      topic: "Basic Circuits",
      difficulty: "Easy",
    },
    {
      id: 402,
      text: "In a purely inductive AC circuit, the current:",
      options: [
        "Leads voltage by 90°",
        "Lags voltage by 90°",
        "Is in phase with voltage",
        "Is zero",
      ],
      correctIndex: 1,
      topic: "AC Circuits",
      difficulty: "Easy",
    },
    {
      id: 403,
      text: "Which machine can operate as both a motor and a generator?",
      options: ["Transformer", "Synchronous machine", "Rectifier", "Inverter"],
      correctIndex: 1,
      topic: "Machines",
      difficulty: "Medium",
    },
    {
      id: 404,
      text: "Why are high voltages used for long‑distance power transmission?",
      options: [
        "To increase line current",
        "To reduce I²R losses",
        "To reduce power factor",
        "To increase skin effect",
      ],
      correctIndex: 1,
      topic: "Power Systems",
      difficulty: "Easy",
    },
    {
      id: 405,
      text: "Subjective: Tell me about a time you diagnosed a fault or issue in an electrical system or circuit. What steps did you take?",
      options: [],
      correctIndex: 0,
      topic: "Practical Experience",
      difficulty: "Medium",
    },
  ],
  "Electronics & Communication": [
    {
      id: 501,
      text: "Which modulation technique varies the amplitude of the carrier with message signal?",
      options: ["AM", "FM", "PM", "PCM"],
      correctIndex: 0,
      topic: "Analog Communication",
      difficulty: "Easy",
    },
    {
      id: 502,
      text: "Nyquist rate is defined as:",
      options: [
        "Twice the highest frequency present in the signal",
        "Half the highest frequency present in the signal",
        "Equal to the signal bandwidth",
        "Independent of signal bandwidth",
      ],
      correctIndex: 0,
      topic: "Signal Processing",
      difficulty: "Medium",
    },
    {
      id: 503,
      text: "Which device is primarily used for amplification in high‑frequency applications?",
      options: ["BJT", "JFET", "MOSFET", "SCR"],
      correctIndex: 2,
      topic: "Electronics Devices",
      difficulty: "Medium",
    },
    {
      id: 504,
      text: "Subjective: Explain a communication or embedded system you have worked on. How did you verify that it worked correctly?",
      options: [],
      correctIndex: 0,
      topic: "Systems",
      difficulty: "Medium",
    },
  ],
  "Chemical Engineering": [
    {
      id: 601,
      text: "Reynolds number is used to characterise:",
      options: ["Heat transfer", "Mass transfer", "Flow regime", "Chemical reaction order"],
      correctIndex: 2,
      topic: "Fluid Mechanics",
      difficulty: "Easy",
    },
    {
      id: 602,
      text: "Which reactor ideally provides the same composition at the outlet as inside the reactor volume?",
      options: ["Batch reactor", "PFR", "CSTR", "Packed bed reactor"],
      correctIndex: 2,
      topic: "Reaction Engineering",
      difficulty: "Medium",
    },
    {
      id: 603,
      text: "HTU and NTU terminology is associated with:",
      options: ["Heat exchangers", "Distillation and absorption columns", "Reactors", "Pumps"],
      correctIndex: 1,
      topic: "Mass Transfer",
      difficulty: "Medium",
    },
    {
      id: 604,
      text: "Subjective: Walk me through a process design or plant operation example you have studied. What constraints did you consider?",
      options: [],
      correctIndex: 0,
      topic: "Process Design",
      difficulty: "Medium",
    },
  ],
};

const getInitialHistory = () => {
  try {
    const raw = localStorage.getItem("rf_attempt_history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const AppContextProvider = ({ children }) => {
  const [selectedEngineering, setSelectedEngineering] = useState("Computer / IT");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [interviewMode, setInterviewMode] = useState("standard"); // 'standard' | 'face-to-face'
  const [subjectiveAnswers, setSubjectiveAnswers] = useState({});
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [questionCount, setQuestionCount] = useState(10);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState(getInitialHistory);

  useEffect(() => {
    localStorage.setItem("rf_attempt_history", JSON.stringify(history));
  }, [history]);

  const generateQuestions = (count) => {
    const baseBank =
      questionBanksByEngineering[selectedEngineering] ||
      questionBanksByEngineering["Computer / IT"];

    const filtered =
      selectedEngineering === "Aptitude / General" && selectedCategories.length
        ? baseBank.filter((q) => selectedCategories.includes(q.category || "Behavioral"))
        : baseBank;

    const objective = filtered.filter((q) => q.options && q.options.length);
    const subjective = filtered.filter((q) => !q.options || !q.options.length);

    const desiredSubjective = Math.min(
      Math.max(1, Math.floor(count / 3)),
      subjective.length,
    );

    const shuffledSubj = [...subjective].sort(() => Math.random() - 0.5);
    const chosenSubj = shuffledSubj.slice(0, desiredSubjective);

    const remaining = Math.max(count - chosenSubj.length, 0);
    const shuffledObj = [...objective].sort(() => Math.random() - 0.5);
    const chosenObj = shuffledObj.slice(0, remaining);

    const combined = [...chosenObj, ...chosenSubj].sort(() => Math.random() - 0.5);

    setCurrentQuestions(combined.slice(0, Math.min(count, combined.length)));
    setAnswers({});
    setSubjectiveAnswers({});
  };

  const recordAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const recordSubjectiveAnswer = (questionId, text) => {
    setSubjectiveAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const computeResults = () => {
    const total = currentQuestions.length;
    let correct = 0;
    const perQuestion = currentQuestions.map((q) => {
      const userIndex = answers[q.id];
      const isSubjective = !q.options || !q.options.length;
      const isCorrect = !isSubjective && userIndex === q.correctIndex;
      if (isCorrect) correct += 1;
      return {
        id: q.id,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        userIndex,
        topic: q.topic,
        difficulty: q.difficulty,
        isCorrect,
        type: isSubjective ? "subjective" : "objective",
        answerText: isSubjective ? subjectiveAnswers[q.id] || "" : "",
      };
    });
    const scorePercent = total ? Math.round((correct / total) * 100) : 0;

    let level = "Foundation";
    if (scorePercent >= 80) level = "Interview‑Ready";
    else if (scorePercent >= 60) level = "Strong Intermediate";
    else if (scorePercent >= 40) level = "Emerging";

    const weakTopics = perQuestion
      .filter((q) => !q.isCorrect)
      .reduce((acc, q) => {
        acc[q.topic] = (acc[q.topic] || 0) + 1;
        return acc;
      }, {});

    const result = {
      total,
      correct,
      scorePercent,
      level,
      perQuestion,
      weakTopics,
      engineering: selectedEngineering,
      role: selectedRole,
      position: selectedPosition,
      skills,
      interviewMode,
      language: selectedLanguage,
      categories: selectedCategories,
      timestamp: new Date().toISOString(),
      questionCount,
    };

    setHistory((prev) => [result, ...prev]);
    localStorage.setItem("rf_last_result", JSON.stringify(result));
    return result;
  };

  const value = useMemo(() => {
    const engineeringDomains = Object.keys(engineeringTracks);
    const currentRoles =
      engineeringTracks[selectedEngineering] && engineeringTracks[selectedEngineering].length
        ? engineeringTracks[selectedEngineering]
        : defaultRoles;

    return {
      engineeringDomains,
      selectedEngineering,
      setSelectedEngineering,
      roles: currentRoles,
      positions: defaultPositions,
      selectedRole,
      setSelectedRole,
      selectedPosition,
      setSelectedPosition,
      aptitudeCategories,
      selectedCategories,
      setSelectedCategories,
      interviewMode,
      setInterviewMode,
      skills,
      setSkills,
      languages: interviewLanguages,
      selectedLanguage,
      setSelectedLanguage,
      questionCount,
      setQuestionCount,
      currentQuestions,
      generateQuestions,
      answers,
      recordAnswer,
      recordSubjectiveAnswer,
      subjectiveAnswers,
      computeResults,
      history,
    };
  }, [
    selectedEngineering,
    selectedRole,
    selectedPosition,
    skills,
    questionCount,
    currentQuestions,
    answers,
    history,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside AppContextProvider");
  return ctx;
};

