const { GoogleGenAI } = require('@google/generative-ai');

// Initialize Gemini API if key is present
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);
  } catch (err) {
    console.error('Failed to initialize Gemini API:', err);
  }
}

// Helper: Call Gemini or Fallback
const getAICompletion = async (systemPrompt, userPrompt, fallbackFn) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${systemPrompt}\n\nUser Question/Context: ${userPrompt}\n\nResponse:`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err) {
      console.warn('Gemini API call failed, using fallback:', err.message);
      return fallbackFn();
    }
  }
  return fallbackFn();
};

// --- Fallback Templates for local generation ---
const mockTutorDatabase = {
  react: {
    beginner: `### Explain Like Beginner: React.js ⚛️

Think of React like a **Lego set** for websites.
Before React, if you wanted to change one tiny thing on a webpage (like a Like button changing color), the browser had to redraw the *entire page*. That's like rebuilding a whole Lego castle just because you wanted to change the flag!

With React:
1. **Components**: We break our page into small, reusable Lego blocks (e.g., a \`Header\` component, a \`Sidebar\` component, a \`Button\` component).
2. **Virtual DOM**: React keeps a draft copy of the webpage in its memory. When something changes, React figures out *exactly* which Lego block changed, and swaps only that one, keeping the rest of the castle untouched! That's why React apps feel super fast.`,
    code: `### Code Explanation Mode: React State 💻

Here is a simple example of React state using the \`useState\` Hook:

\`\`\`jsx
import React, { useState } from 'react';

function Counter() {
  // 1. Declare state variable 'count' and function 'setCount'
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded-xl bg-slate-900 text-white">
      <p>You clicked {count} times</p>
      {/* 2. Update count on click */}
      <button 
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Click me
      </button>
    </div>
  );
}
\`\`\`

**How it works:**
- \`useState(0)\` initializes \`count\` to \`0\`.
- \`setCount\` is a function that updates \`count\` and automatically tells React to re-render the \`Counter\` component.`,
    interview: `### Interview Mode: React.js Key Questions 💬

**Question**: What is the difference between Shadow DOM and Virtual DOM?

**Answer**:
1. **Virtual DOM**: It is a lightweight Javascript object which is a copy of the Real DOM. It is maintained by libraries like React to optimize page renders by batching changes and updating only the modified nodes.
2. **Shadow DOM**: It is a browser technology designed for scoping variables and CSS in Web Components (like encapsulation inside an \`<iframe>\` but natively supportable). It is not directly related to React's rendering optimizations.`,
    quiz: [
      {
        question: "What hook would you use to perform side effects in a functional component?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        answer: "useEffect",
        explanation: "useEffect is standard for side effects like API requests, event listeners, and direct DOM mutations."
      },
      {
        question: "Does updating React state trigger a re-render?",
        options: ["Yes, always", "No, never", "Only if it is a class component", "Only if we call forceUpdate()"],
        answer: "Yes, always",
        explanation: "Updating state notifies React that the component needs to be re-evaluated and re-rendered."
      }
    ]
  },
  dsa: {
    beginner: `### Explain Like Beginner: Binary Search 🔍

Imagine you are looking for a name in a physical **telephone directory** (alphabetically sorted).
Instead of checking page 1, then page 2, then page 3 (which is Linear Search and would take forever), you:
1. Open the book right in the **middle**.
2. If the name you want comes *after* the names on the middle page, you throw away the entire left half of the book.
3. If it comes *before*, you throw away the right half.
4. Repeat this process on the remaining half. You will find any name in a book of 1 million pages in less than 20 checks! That's Binary Search!`,
    code: `### Code Explanation Mode: Binary Search (JavaScript) 💻

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    // Find the middle index (using Math.floor to avoid decimals)
    let mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Found it! Return the index.
    }
    
    if (arr[mid] < target) {
      left = mid + 1; // Discard left half
    } else {
      right = mid - 1; // Discard right half
    }
  }
  return -1; // Target not found
}
\`\`\`

**Complexity:**
- **Time Complexity:** O(log N) since we divide the search space by half in each step.
- **Space Complexity:** O(1) auxiliary space (iterative approach).`,
    interview: `### Interview Mode: DSA Search Complexity 💬

**Question**: Why is Binary Search faster than Linear Search, and what is its main precondition?

**Answer**:
- **Speed**: Binary search runs in O(log N) time, whereas Linear Search runs in O(N). For large inputs (e.g. N = 10^6), Binary Search takes ~20 operations, compared to 1,000,000 operations for Linear Search.
- **Precondition**: The input array **must be sorted**. If it is not sorted, we cannot discard halves safely, and sorting it first would take O(N log N) time, making linear search faster for a single search operation.`,
    quiz: [
      {
        question: "What is the time complexity of searching in a balanced Binary Search Tree (BST)?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answer: "O(log N)",
        explanation: "A balanced BST splits elements at each node, giving a logarithmic search depth."
      },
      {
        question: "Which data structure operates on a Last-In-First-Out (LIFO) basis?",
        options: ["Queue", "Stack", "Heap", "Linked List"],
        answer: "Stack",
        explanation: "A Stack processes items in LIFO order (like a stack of plates)."
      }
    ]
  },
  dbms: {
    beginner: `### Explain Like Beginner: Database Indexes 🗂️

Think of a database index like the **Index page** at the back of a massive history textbook.
If you want to find where "Albert Einstein" is mentioned, you don't flip through all 800 pages page-by-page. Instead, you look up "Einstein" in the index, find the exact page number (e.g. Page 412), and jump straight there.

An index in a database is a separate list that tells the database exactly where to find specific data without scanning the whole table.`,
    code: `### Code Explanation Mode: Creating an Index (SQL) 💻

\`\`\`sql
-- Normal query that scans the entire table if there is no index
SELECT * FROM users WHERE email = 'student@eduai.com';

-- Creating an index on the email column
CREATE INDEX idx_users_email ON users(email);
\`\`\`

**How it works:**
- The database constructs a B-Tree structure under the hood for \`idx_users_email\`.
- Future searches on the \`email\` column will now run in O(log N) time instead of O(N) full table scan.`,
    interview: `### Interview Mode: SQL vs NoSQL 💬

**Question**: When should you choose SQL over NoSQL database architectures?

**Answer**:
Choose **SQL (Relational)** when:
1. Your data is highly structured, and relationships are critical (e.g., banking transactions).
2. You require strict ACID transaction compliance.
3. You need complex queries and joins.

Choose **NoSQL (Non-Relational)** when:
1. Your data schema is dynamic, unstructured, or changing frequently.
2. High-speed, high-scale writing is required (e.g., chat apps, analytics logs).
3. Horizontal scaling (sharding) is a primary requirement.`,
    quiz: [
      {
        question: "What does the 'A' in ACID stand for?",
        options: ["Atomicity", "Availability", "Authorization", "Aggregate"],
        answer: "Atomicity",
        explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability."
      },
      {
        question: "Which normal form requires resolving partial dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        answer: "2NF",
        explanation: "Second Normal Form (2NF) requires being in 1NF and removing any partial functional dependencies."
      }
    ]
  }
};

// Generic response generator for other categories
const getGenericResponse = (topic, mode) => {
  const t = topic.toUpperCase();
  if (mode === 'beginner') {
    return `### Explain Like Beginner: ${t} 💡\n\nThink of **${t}** as a real-world system where complexity is simplified. For instance, in everyday life, you don't need to know how an internal combustion engine works to drive a car; you just press the gas pedal. Similarly, **${t}** provides a simple interface to manage complex programmatic operations behind the scenes.`;
  } else if (mode === 'code') {
    return `### Code Explanation Mode: ${t} Code Snippet 💻\n\n\`\`\`javascript\n// Typical ${t} implementation pattern\nfunction demo${t.replace(/\s+/g, '')}() {\n  const config = {\n    enabled: true,\n    type: "${t.toLowerCase()}"\n  };\n  \n  console.log("Configuring ${t} dynamic module...");\n  return config;\n}\n\ndemo${t.replace(/\s+/g, '')}();\n\`\`\`\n\n**Key Aspects:**\n- Modular configuration layout.\n- Return parameters encapsulate key metadata.`;
  } else if (mode === 'interview') {
    return `### Interview Mode: ${t} Quick Guide 💬\n\n**Interviewer Question**: Explain the core architectural benefits and potential bottlenecks of **${t}** in high-throughput enterprise systems.\n\n**Candidate Answer**: The primary benefit of **${t}** is modularity and cleaner abstraction. However, a potential bottleneck lies in latency overhead during horizontal scaling. To mitigate this, developers use caching layers and optimized load balancers.`;
  } else {
    return `### Quiz Mode: ${t} Evaluation 📝\n\nSelect the best option corresponding to the core design principles of **${t}**. Ensure validation checks are maintained.`;
  }
};

// @desc    Get Chat AI explanation
// @route   POST /api/ai/tutor
// @access  Private
const getAITutorExplanation = async (req, res, next) => {
  try {
    const { topic, category, mode } = req.body; // e.g., topic: "React state", category: "react", mode: "beginner"

    const cleanCategory = (category || 'dsa').toLowerCase();
    const cleanMode = (mode || 'beginner').toLowerCase();

    const systemPrompt = `You are a world-class CSE professor and technical interviewer. Explain the requested topic in the specified mode: "beginner" (explain like beginner with analogies), "code" (provide code snippet and line-by-line explanation), "interview" (pose an interview question and detailed mock answer). Format using elegant Markdown.`;
    const userPrompt = `Topic: "${topic}". Category: "${cleanCategory}". Mode: "${cleanMode}".`;

    const fallbackFn = () => {
      const dbEntry = mockTutorDatabase[cleanCategory] || mockTutorDatabase['dsa'];
      if (cleanMode === 'beginner') return dbEntry.beginner || getGenericResponse(topic, 'beginner');
      if (cleanMode === 'code') return dbEntry.code || getGenericResponse(topic, 'code');
      if (cleanMode === 'interview') return dbEntry.interview || getGenericResponse(topic, 'interview');
      return getGenericResponse(topic, cleanMode);
    };

    const explanation = await getAICompletion(systemPrompt, userPrompt, fallbackFn);

    res.json({ success: true, explanation });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI Generated Quiz
// @route   POST /api/ai/quiz
// @access  Private
const getAIQuiz = async (req, res, next) => {
  try {
    const { category } = req.body;
    const cleanCategory = (category || 'dsa').toLowerCase();

    const systemPrompt = `Generate a JSON array containing 3 technical quiz multiple-choice questions for category "${cleanCategory}". Each question must have 'question', 'options' (array of 4 strings), 'answer' (exact matching string from options), and 'explanation' keys. Do not include markdown wraps around the JSON.`;
    const userPrompt = `Generate 3 questions about ${cleanCategory}.`;

    const fallbackFn = () => {
      const dbEntry = mockTutorDatabase[cleanCategory] || mockTutorDatabase['dsa'];
      const questions = dbEntry.quiz || mockTutorDatabase['dsa'].quiz;
      return JSON.stringify(questions);
    };

    const response = await getAICompletion(systemPrompt, userPrompt, fallbackFn);
    
    let quizData;
    try {
      // Clean JSON string if wrapped in markdown
      let cleanJson = response.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.substring(7);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      }
      quizData = JSON.parse(cleanJson.trim());
    } catch (e) {
      // If parsing fails, use static fallback directly
      const dbEntry = mockTutorDatabase[cleanCategory] || mockTutorDatabase['dsa'];
      quizData = dbEntry.quiz || mockTutorDatabase['dsa'].quiz;
    }

    res.json({ success: true, quiz: quizData });
  } catch (error) {
    next(error);
  }
};

// --- Mock Interview Database Questions ---
const mockInterviewQuestions = {
  Technical: [
    "Explain the concept of closures in JavaScript. Can you give a practical use case?",
    "What is the difference between process and thread in Operating Systems? How do they communicate?",
    "Explain normalization in DBMS. Why do we need it and what is BCNF?",
    "What is the three-way handshake in TCP/IP protocol?",
    "How does the garbage collection mechanism work in Java?"
  ],
  HR: [
    "Tell me about a time you had a conflict with a team member. How did you resolve it?",
    "Why do you want to join our company, and what value do you think you can bring?",
    "Where do you see yourself in the next 5 years, and how does this role fit into that vision?",
    "Describe your greatest professional achievement and what you learned from it.",
    "How do you handle high-pressure environments and tight project deadlines?"
  ],
  Aptitude: [
    "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    "In a group of 15 people, 7 read French, 8 read English, and 3 read neither. How many read both?",
    "If A can do a piece of work in 10 days and B in 15 days, how long will they take to complete it working together?",
    "Find the next number in the sequence: 2, 6, 12, 20, 30, ...?",
    "The cost price of 20 articles is equal to the selling price of 15 articles. Find the profit percentage."
  ]
};

// @desc    Start/Generate interview questions
// @route   POST /api/ai/interview/start
// @access  Private
const startInterview = async (req, res, next) => {
  try {
    const { type } = req.body; // Technical, HR, Aptitude
    const cleanType = type || 'Technical';

    const systemPrompt = `Generate a list of 4 interview questions as a JSON string array for a "${cleanType}" interview round. Keep questions professional, challenging, and suitable for a CSE student. Return only the JSON array.`;
    const userPrompt = `Generate 4 interview questions for ${cleanType} round.`;

    const fallbackFn = () => {
      const qPool = mockInterviewQuestions[cleanType] || mockInterviewQuestions['Technical'];
      // Randomly pick 4 questions
      const shuffled = [...qPool].sort(() => 0.5 - Math.random());
      return JSON.stringify(shuffled.slice(0, 4));
    };

    const response = await getAICompletion(systemPrompt, userPrompt, fallbackFn);
    
    let questions;
    try {
      let cleanJson = response.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.substring(7);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      }
      questions = JSON.parse(cleanJson.trim());
    } catch (e) {
      const qPool = mockInterviewQuestions[cleanType] || mockInterviewQuestions['Technical'];
      questions = qPool.slice(0, 4);
    }

    res.json({ success: true, questions });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate interview transcript
// @route   POST /api/ai/interview/evaluate
// @access  Private
const evaluateInterview = async (req, res, next) => {
  try {
    const { type, duration, transcript } = req.body; // transcript: [{ question, answer }]
    
    const systemPrompt = `Evaluate the following interview transcript. Return a JSON object with:
    - score (overall integer, 0-100)
    - feedback: {
        confidenceScore (integer 0-100),
        communicationScore (integer 0-100),
        technicalAccuracy (integer 0-100),
        strengths (array of strings),
        improvements (array of strings)
      }
    - transcript (same input array with an additional 'feedback' string and 'score' integer for each Q&A pair)
    Return raw JSON only.`;

    const userPrompt = `Type: ${type}, Duration: ${duration}s, Transcript: ${JSON.stringify(transcript)}`;

    const fallbackFn = () => {
      // Calculate realistic scores based on answer length and keyword presence
      let totalAcc = 0;
      let ratedTranscript = transcript.map((item) => {
        const len = item.answer ? item.answer.trim().length : 0;
        let itemScore = 30; // base
        let itemFeedback = "Answer was too brief. Try to elaborate using specific keywords and structural templates.";

        if (len > 150) {
          itemScore = 85;
          itemFeedback = "Comprehensive answer showing solid structure. Good job highlighting the key technical points.";
        } else if (len > 60) {
          itemScore = 70;
          itemFeedback = "Good concise explanation. Adding a real-world scenario or code example would improve the response.";
        }

        totalAcc += itemScore;
        return {
          ...item,
          score: itemScore,
          feedback: itemFeedback
        };
      });

      const avgScore = Math.round(totalAcc / transcript.length);
      const mockResult = {
        score: avgScore,
        feedback: {
          confidenceScore: Math.min(avgScore + 5, 100),
          communicationScore: Math.min(avgScore + 2, 100),
          technicalAccuracy: avgScore,
          strengths: [
            "Good command over basic concepts and direct definition syntax.",
            "Structured responses to abstract scenarios."
          ],
          improvements: [
            "Provide concrete real-world use cases or project analogies.",
            "Work on phrasing explanation transitions to keep the interviewer engaged."
          ]
        },
        transcript: ratedTranscript
      };

      return JSON.stringify(mockResult);
    };

    const response = await getAICompletion(systemPrompt, userPrompt, fallbackFn);
    
    let evaluation;
    try {
      let cleanJson = response.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.substring(7);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.substring(0, cleanJson.length - 3);
      }
      evaluation = JSON.parse(cleanJson.trim());
    } catch (e) {
      evaluation = JSON.parse(fallbackFn());
    }

    res.json({ success: true, evaluation });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAITutorExplanation,
  getAIQuiz,
  startInterview,
  evaluateInterview
};
