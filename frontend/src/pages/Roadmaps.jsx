import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Trophy, 
  ChevronRight, 
  Target,
  Layers,
  Sparkles
} from 'lucide-react';

const Roadmaps = () => {
  const { roadmaps, toggleRoadmapTopic } = useContext(AuthContext);
  const [activeTrack, setActiveTrack] = useState('MERN Stack');

  const tracks = {
    'MERN Stack': [
      { id: 'mern-1', title: 'JavaScript ES6+ Fundamentals', desc: 'Scope, closures, promises, async/await, and prototypes.' },
      { id: 'mern-2', title: 'React Hooks & Context API', desc: 'State tracking, useEffect cycle, useContext, and custom hook structures.' },
      { id: 'mern-3', title: 'CSS Frameworks & Flexbox/Grid', desc: 'Responsive setups, layouts, TailwindCSS configs.' },
      { id: 'mern-4', title: 'Vite & Frontend Routing', desc: 'SPA structures, React Router parameters, and route guards.' },
      { id: 'mern-5', title: 'Node.js & Express.js Server Base', desc: 'REST specifications, request/response headers, and global routing.' },
      { id: 'mern-6', title: 'MongoDB Schemas & Mongoose', desc: 'Document schemas, validations, relationships, and queries.' },
      { id: 'mern-7', title: 'JWT Authentication & Security', desc: 'Access tokens, bcrypt hashing, and authentication middlewares.' },
      { id: 'mern-8', title: 'Deployment & CI/CD Pipelines', desc: 'Vercel, Render, Docker setups, and GitHub Actions logs.' }
    ],
    'DSA Roadmap': [
      { id: 'dsa-1', title: 'Asymptotic Complexity Analysis', desc: 'Big O, Time & Space limits, and nested loop scaling.' },
      { id: 'dsa-2', title: 'Arrays & Hashing Structures', desc: 'HashMap mappings, Two Sum algorithms, and sliding windows.' },
      { id: 'dsa-3', title: 'Stack & Queue Computations', desc: 'FIFO/LIFO logic, parentheses matching, and reverse polish expressions.' },
      { id: 'dsa-4', title: 'Binary Search Implementation', desc: 'Search bounds, rotated arrays, and index search speeds.' },
      { id: 'dsa-5', title: 'Linked List Pointers', desc: 'Reversals, loop detection, and two-pointer node splits.' },
      { id: 'dsa-6', title: 'Trees & Recursive Traversal', desc: 'DFS, BFS traversals, BST validations, and node balances.' },
      { id: 'dsa-7', title: 'Dynamic Programming', desc: 'Memoization tables, knapsack problems, and Fibonacci scales.' }
    ],
    'Placement Preparation': [
      { id: 'prep-1', title: 'Operating Systems - Processes & Threads', desc: 'Process lifecycles, threading limits, and scheduling algorithms.' },
      { id: 'prep-2', title: 'DBMS Normalization & SQL Queries', desc: '1NF, 2NF, 3NF, BCNF rules, joins, and indexing structures.' },
      { id: 'prep-3', title: 'Computer Networks - OSI layers & TCP/IP', desc: 'TCP handshakes, HTTP specs, DNS, and subnetting schemes.' },
      { id: 'prep-4', title: 'Object Oriented Programming', desc: 'Encapsulation, inheritance, polymorphism, and abstract templates.' },
      { id: 'prep-5', title: 'Aptitude & Logical Reasonings', desc: 'Time-speed-distance, profit margins, and sequences.' }
    ]
  };

  const getCompletedCount = (trackName) => {
    const roadmap = roadmaps.find(r => r.title === trackName);
    return roadmap ? roadmap.completedTopics.length : 0;
  };

  const getProgressPercent = (trackName) => {
    const total = tracks[trackName].length;
    const completed = getCompletedCount(trackName);
    return Math.round((completed / total) * 100) || 0;
  };

  const isTopicCompleted = (trackName, topicId) => {
    const roadmap = roadmaps.find(r => r.title === trackName);
    return roadmap ? roadmap.completedTopics.includes(topicId) : false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Personalized Learning Roadmaps</h1>
          <p className="text-xs text-slate-400 mt-1">Track curriculum checkpoints and measure placements readiness stats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Track Selectors */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Available Tracks</h3>
            {Object.keys(tracks).map((trackName) => {
              const active = activeTrack === trackName;
              const percent = getProgressPercent(trackName);
              return (
                <button
                  key={trackName}
                  onClick={() => setActiveTrack(trackName)}
                  className={`flex flex-col w-full p-3.5 rounded-xl border text-left transition-all ${
                    active 
                      ? 'border-primary-600 bg-primary-600/5 dark:bg-primary-650/10' 
                      : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                >
                  <span className={`text-xs font-bold ${active ? 'text-primary-650 dark:text-primary-405' : 'text-slate-655 dark:text-slate-350'}`}>
                    {trackName}
                  </span>
                  {/* Miniature progress bar */}
                  <div className="flex items-center gap-2 mt-2.5 w-full">
                    <div className="flex-1 bg-slate-150 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{percent}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Placement milestones card */}
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-800/40 text-white relative overflow-hidden shadow-sm">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-primary-600/10 rounded-full filter blur-[20px]"></div>
            <Trophy size={20} className="text-amber-500 mb-3 animate-pulse" />
            <h4 className="font-extrabold text-xs tracking-wider uppercase">Placements Ready Meter</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Complete at least 70% of MERN Stack and DSA milestones to unlock dynamic mock interviews recommendations.</p>
          </div>
        </div>

        {/* Right Column: Node List Path */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-6">
            {/* Header Track Info */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="font-extrabold text-slate-800 dark:text-slate-200 text-base">{activeTrack} Path</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click checkpoints to mark topics as solved</p>
              </div>
              <div className="flex items-center gap-1 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold">
                <Target size={14} />
                <span>{getCompletedCount(activeTrack)} / {tracks[activeTrack].length} Finished</span>
              </div>
            </div>

            {/* Timeline Nodes */}
            <div className="relative pl-6 space-y-6 border-l-2 border-slate-100 dark:border-slate-850 ml-3.5">
              {tracks[activeTrack].map((node, idx) => {
                const completed = isTopicCompleted(activeTrack, node.id);
                return (
                  <div key={node.id} className="relative group">
                    {/* Checkbox connector ring */}
                    <button
                      onClick={() => toggleRoadmapTopic(activeTrack, node.id)}
                      className={`absolute -left-[35px] top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 z-10 transition-transform hover:scale-110 active:scale-95 ${
                        completed ? 'text-primary-600 dark:text-primary-400' : 'text-slate-300 dark:text-slate-700'
                      }`}
                    >
                      {completed ? <CheckCircle2 size={20} fill="currentColor" className="text-white dark:text-slate-900" /> : <Circle size={20} />}
                    </button>

                    <div className={`p-4 rounded-xl border transition-all ${
                      completed 
                        ? 'border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01]' 
                        : 'border-slate-100 dark:border-slate-850 hover:border-slate-250 dark:hover:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30'
                    }`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className={`text-xs font-bold leading-none ${completed ? 'text-slate-500 line-through' : 'text-slate-800 dark:text-slate-205'}`}>
                            {idx + 1}. {node.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">{node.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
