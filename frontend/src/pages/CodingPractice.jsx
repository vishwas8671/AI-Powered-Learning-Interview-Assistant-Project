import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Code2, 
  ChevronLeft, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  Bookmark,
  Sparkles,
  BookOpen
} from 'lucide-react';

const CodingPractice = () => {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  
  // Running state
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('desc'); // desc, submissions

  // AI Hint state
  const [hintLoading, setHintLoading] = useState(false);
  const [aiHint, setAiHint] = useState('');

  // Fetch problems list
  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data } = await axios.get('/api/practice/problems');
      if (data.success) {
        setProblems(data.problems);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data } = await axios.get('/api/practice/submissions');
      if (data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectProblem = (prob) => {
    setSelectedProblem(prob);
    setLanguage('javascript');
    setCode(prob.starterCodes['javascript']);
    setResult(null);
    setErrorMsg('');
    setAiHint('');
    setActiveWorkspaceTab('desc');
    fetchSubmissions();
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (selectedProblem) {
      setCode(selectedProblem.starterCodes[lang]);
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setRunning(true);
    setResult(null);
    setErrorMsg('');

    try {
      const { data } = await axios.post('/api/practice/run', {
        problemId: selectedProblem.id,
        language,
        code
      });

      if (data.success) {
        setResult(data.submission);
        setErrorMsg(data.errorMessage);
        fetchSubmissions(); // reload submissions list
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Execution error');
    } finally {
      setRunning(false);
    }
  };

  const handleGetHint = async () => {
    if (!selectedProblem) return;
    setHintLoading(true);
    setAiHint('');
    try {
      const { data } = await axios.post('/api/ai/tutor', {
        topic: `Give me a structural hint to solve "${selectedProblem.title}" problem. Write in high-level pseudocode or brief instructions.`,
        category: 'dsa',
        mode: 'beginner'
      });
      if (data.success) {
        setAiHint(data.explanation);
      }
    } catch (err) {
      setAiHint('Failed to consult AI. Please try again.');
    } finally {
      setHintLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      {!selectedProblem ? (
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-sans">Coding Practice Room</h1>
          <p className="text-xs text-slate-400 mt-1">Implement algorithmic logic inside a sandboxed runner.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-850 pb-4">
          <button
            onClick={() => setSelectedProblem(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            <ChevronLeft size={16} />
            <span>Problem Index</span>
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              selectedProblem.difficulty === 'Easy' 
                ? 'bg-emerald-500/10 text-emerald-500' 
                : 'bg-amber-500/10 text-amber-500'
            }`}>
              {selectedProblem.difficulty}
            </span>
            <span className="text-xs text-slate-400 font-semibold">{selectedProblem.category}</span>
          </div>
        </div>
      )}

      {/* PROBLEM INDEX SELECTION VIEW */}
      {!selectedProblem && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((prob) => (
            <div
              key={prob.id}
              onClick={() => handleSelectProblem(prob)}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl cursor-pointer hover:border-primary-500/30 transition-all duration-300 shadow-sm flex flex-col justify-between min-h-[170px] group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    prob.difficulty === 'Easy' 
                      ? 'bg-emerald-500/10 text-emerald-500' 
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {prob.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-405 font-bold">{prob.category}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary-600 transition-colors">{prob.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{prob.description}</p>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800/40 mt-4">
                <span className="text-[10px] font-bold text-primary-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Solve Problem <Play size={10} fill="currentColor" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE CODING WORKSPACE */}
      {selectedProblem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Console: Details / Hints / Submissions (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex-1 flex flex-col justify-between">
              <div>
                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-800 gap-4 mb-4 pb-2 text-xs font-bold">
                  <button 
                    onClick={() => setActiveWorkspaceTab('desc')}
                    className={`pb-1 ${activeWorkspaceTab === 'desc' ? 'text-primary-600 border-b-2 border-primary-650' : 'text-slate-400'}`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveWorkspaceTab('submissions')}
                    className={`pb-1 ${activeWorkspaceTab === 'submissions' ? 'text-primary-600 border-b-2 border-primary-650' : 'text-slate-400'}`}
                  >
                    Submissions
                  </button>
                </div>

                {activeWorkspaceTab === 'desc' ? (
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    <h2 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">{selectedProblem.title}</h2>
                    <div className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">
                      {selectedProblem.description}
                    </div>

                    {/* Examples */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Examples:</h4>
                      {selectedProblem.examples.map((ex, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl space-y-1.5 text-xs">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">Example {idx + 1}:</p>
                          <p className="font-mono text-[11px]"><span className="text-slate-400">Input:</span> {ex.input}</p>
                          <p className="font-mono text-[11px]"><span className="text-slate-400">Output:</span> {ex.output}</p>
                          {ex.explanation && (
                            <p className="text-[10px] text-slate-455 mt-1 leading-relaxed"><span className="font-bold">Explanation:</span> {ex.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Constraints */}
                    <div className="space-y-1.5 pt-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Constraints:</h4>
                      <ul className="list-disc pl-4 text-[10px] text-slate-400 space-y-0.5">
                        {selectedProblem.constraints.map((c, idx) => (
                          <li key={idx} className="font-mono">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  // Submissions list
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {submissions.filter(s => s.problemId === selectedProblem.id).length > 0 ? (
                      submissions.filter(s => s.problemId === selectedProblem.id).map((sub) => (
                        <div key={sub._id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <span className={`font-bold uppercase text-[9px] px-1.5 py-0.5 rounded ${
                              sub.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                              {sub.status}
                            </span>
                            <p className="text-[10px] text-slate-450 mt-1.5">Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400">{sub.language}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-405">
                        No submissions recorded for this problem yet.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Get AI Hint button */}
              {activeWorkspaceTab === 'desc' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-4 space-y-2">
                  {aiHint ? (
                    <div className="p-3 bg-primary-500/5 dark:bg-primary-950/20 border border-primary-550/20 rounded-xl text-xs text-slate-650 dark:text-slate-350 leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-wrap">
                      <span className="font-bold text-primary-650 dark:text-primary-400 flex items-center gap-1 mb-1">
                        <Sparkles size={12} className="animate-pulse" /> AI Hint:
                      </span>
                      {aiHint}
                    </div>
                  ) : (
                    <button
                      onClick={handleGetHint}
                      disabled={hintLoading}
                      className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                    >
                      {hintLoading ? (
                        <div className="w-4 h-4 border-2 border-slate-550 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <HelpCircle size={14} />
                          <span>Request AI Hint</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Console: Code Editor Workspace (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between min-h-[480px]">
              <div className="space-y-4 flex-grow flex flex-col">
                {/* Editor Header controls */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Terminal size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Editor Console</span>
                  </div>

                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                </div>

                {/* Editor Textarea */}
                <div className="flex-grow flex relative border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden code-glow bg-slate-950">
                  {/* Fake numbers list for compiler feel */}
                  <div className="py-4 pl-3.5 pr-2 bg-slate-950 text-slate-700 dark:text-slate-600 text-xs font-mono select-none text-right border-r border-slate-800/50 hidden sm:block">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck="false"
                    className="w-full h-full p-4 bg-slate-950 text-emerald-400 dark:text-emerald-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Status Results Pane */}
              {(result || errorMsg) && (
                <div className="mt-4 p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-850 space-y-2">
                  <h4 className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest">Execution Verdict</h4>
                  {result ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {result.status === 'Accepted' ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                        <span className={`text-xs font-bold ${result.status === 'Accepted' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {result.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-450">Passed {result.testCasesPassed} of {result.totalTestCases} test cases.</p>
                      {errorMsg && <p className="text-[10px] text-amber-500 font-semibold mt-1">Note: {errorMsg}</p>}
                    </div>
                  ) : (
                    <p className="text-xs text-red-500 font-mono">{errorMsg}</p>
                  )}
                </div>
              )}

              {/* Run Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-805/60 mt-4">
                <button
                  onClick={handleRunCode}
                  disabled={running || !code.trim()}
                  className="px-6 py-2.5 bg-primary-650 hover:bg-primary-750 disabled:opacity-40 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary-500/10 transition"
                >
                  {running ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" />
                      <span>Run Code & Evaluate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodingPractice;
