import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  BookOpen, 
  HelpCircle, 
  Code2, 
  MessageSquare, 
  Bookmark, 
  BookmarkCheck,
  Send,
  Save,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const Tutor = () => {
  const { bookmarks, toggleBookmark, saveNote, notes } = useContext(AuthContext);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('dsa');
  const [mode, setMode] = useState('beginner'); // beginner, code, interview, quiz
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Notes state
  const [noteContent, setNoteContent] = useState('');
  const [noteSavedMsg, setNoteSavedMsg] = useState(false);

  const categories = [
    { id: 'dsa', name: 'DSA' },
    { id: 'react', name: 'React.js' },
    { id: 'dbms', name: 'DBMS' },
    { id: 'os', name: 'Operating Systems' },
    { id: 'cn', name: 'Computer Networks' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'java', name: 'Java' },
    { id: 'aptitude', name: 'Aptitude' },
    { id: 'hr', name: 'HR Interview' }
  ];

  const modes = [
    { id: 'beginner', name: 'Explain Like Beginner', icon: BookOpen, desc: 'Conceptual analogies & simple phrasing' },
    { id: 'code', name: 'Code Explanation', icon: Code2, desc: 'Annotated source code & walkthroughs' },
    { id: 'interview', name: 'Interview Q&A', icon: MessageSquare, desc: 'Professional Q&A & critical grading' },
    { id: 'quiz', name: 'Quiz Me', icon: HelpCircle, desc: 'Self-evaluation technical test' }
  ];

  const handleAskTutor = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setExplanation('');
    setQuizQuestions([]);
    setQuizSubmitted(false);
    setSelectedAnswers({});
    setNoteSavedMsg(false);

    // Sync note content if there's an existing note
    const existing = notes.find(n => n.questionTitle.toLowerCase() === topic.toLowerCase());
    setNoteContent(existing ? existing.content : '');

    try {
      if (mode === 'quiz') {
        const { data } = await axios.post('/api/ai/quiz', { category });
        if (data.success) {
          setQuizQuestions(data.quiz);
        }
      } else {
        const { data } = await axios.post('/api/ai/tutor', { topic, category, mode });
        if (data.success) {
          setExplanation(data.explanation);
        }
      }
    } catch (err) {
      console.error(err);
      setExplanation('### Connection Error\n\nCould not communicate with the AI agent. Verify your Node server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!topic.trim()) return;
    const res = await saveNote(topic, noteContent);
    if (res.success) {
      setNoteSavedMsg(true);
      setTimeout(() => setNoteSavedMsg(false), 2000);
    }
  };

  const handleSelectOption = (qIdx, opt) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: opt
    }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const isBookmarked = bookmarks.includes(topic);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">AI Learning Assistant</h1>
          <p className="text-xs text-slate-400 mt-1">Acquire technical depth across topics through interactive modes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Settings and Query Form */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technical Domain</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mode Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Explanatory Lens</label>
              <div className="space-y-2">
                {modes.map((m) => {
                  const Icon = m.icon;
                  const active = mode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`flex items-start gap-3 w-full p-3 rounded-xl border text-left transition-all ${
                        active 
                          ? 'border-primary-600 bg-primary-600/5 dark:bg-primary-650/10 text-primary-650 dark:text-primary-400' 
                          : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon size={18} className="mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold">{m.name}</h4>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleAskTutor} className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Concept</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={mode === 'quiz' ? 'e.g. Basic array metrics' : 'e.g. Closures, Binary Trees, Joins'}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-700 dark:text-slate-200 text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || !topic.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-750 transition disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: AI Response Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Console */}
          <div className="min-h-[380px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col justify-between">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-650 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-xs text-slate-400 font-semibold uppercase tracking-wider animate-pulse">Consulting technical node...</p>
              </div>
            ) : explanation ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                {/* Header Actions */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-primary-500 uppercase tracking-widest">{category} • {mode}</span>
                  <button
                    onClick={() => toggleBookmark(topic)}
                    className="p-1.5 text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Topic'}
                  >
                    {isBookmarked ? <BookmarkCheck size={20} className="text-primary-600 dark:text-primary-400" /> : <Bookmark size={20} />}
                  </button>
                </div>

                {/* Content Renderer */}
                <div className="flex-1 text-slate-700 dark:text-slate-300 text-sm leading-relaxed overflow-y-auto max-h-[360px] whitespace-pre-wrap font-sans">
                  {explanation}
                </div>

                {/* Notes Input Field */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Personal Study Notes</label>
                    {noteSavedMsg && (
                      <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> Notes Saved Successfully
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Take structured notes on closures, memory execution stack, or sample patterns..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-700 dark:text-slate-200 text-xs resize-none"
                    />
                    <button
                      onClick={handleSaveNote}
                      className="px-3.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white rounded-xl flex items-center justify-center transition"
                      title="Save note"
                    >
                      <Save size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : quizQuestions.length > 0 ? (
              <div className="flex-grow flex flex-col justify-between">
                {/* Quiz Mode Layout */}
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Concept Review Test</h3>
                    <p className="text-xs text-slate-400">Answer the generated questions below to test your understanding</p>
                  </div>

                  <div className="space-y-6 max-h-[380px] overflow-y-auto pr-1">
                    {quizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="space-y-2">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{qIdx + 1}. {q.question}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[qIdx] === opt;
                            const isCorrect = opt === q.answer;
                            
                            let optClass = "p-3 text-xs font-semibold rounded-xl border text-left transition-all ";
                            if (quizSubmitted) {
                              if (isCorrect) {
                                optClass += "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400";
                              } else if (isSelected) {
                                optClass += "bg-red-500/10 border-red-500 text-red-600 dark:text-red-400";
                              } else {
                                optClass += "bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 opacity-60";
                              }
                            } else {
                              optClass += isSelected 
                                ? "border-primary-600 bg-primary-600/5 text-primary-650 dark:text-primary-400" 
                                : "border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-600 dark:text-slate-400";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleSelectOption(qIdx, opt)}
                                className={optClass}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {quizSubmitted && (
                          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-100 dark:border-slate-850">
                            <span className="font-bold text-slate-700 dark:text-slate-350">Explanation:</span> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs transition"
                    >
                      Grade Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleAskTutor}
                      className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-750 dark:hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      Retake Test
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-center">
                <span className="text-4xl animate-bounce">🎓</span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-300 mt-3">Ready to Explain</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                  Enter a technical topic on the left (e.g. "React Context API" or "Quicksort") to begin your study session.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
