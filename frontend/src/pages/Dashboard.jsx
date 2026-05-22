import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  Award, 
  BookOpen, 
  Code2, 
  FileText, 
  Flame, 
  ChevronRight, 
  CheckCircle,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    solvedCount: user?.analytics?.problemsSolved || 0,
    interviewsCount: user?.analytics?.interviewsCompleted || 0,
    averageScore: user?.analytics?.averageScore || 0
  });
  
  const [interviewHistory, setInterviewHistory] = useState([
    { name: 'Mock 1', score: 65 },
    { name: 'Mock 2', score: 72 },
    { name: 'Mock 3', score: 80 },
    { name: 'Mock 4', score: 78 },
    { name: 'Mock 5', score: 85 }
  ]);

  // Load actual submissions / interview counts
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile');
        if (data.success) {
          setMetrics({
            solvedCount: data.analytics.problemsSolved,
            interviewsCount: data.analytics.interviewsCompleted,
            averageScore: data.analytics.averageScore
          });
        }
      } catch (err) {
        console.warn('Could not update metrics from profile', err);
      }
    };
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: 'Current Streak',
      value: `${user?.streak || 1} Days`,
      desc: 'Active preparation streak',
      icon: Flame,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Coding Solved',
      value: `${metrics.solvedCount} Problems`,
      desc: 'DSA and algorithm practice',
      icon: Code2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'Mock Sessions',
      value: `${metrics.interviewsCount} Rounds`,
      desc: 'Technical, HR, and Aptitude',
      icon: MessageSquare,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Average Score',
      value: `${metrics.averageScore || 78}%`,
      desc: 'Mock evaluation rating',
      icon: Award,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
    }
  ];

  const dailyChallenges = [
    { id: 'chal-1', task: 'Implement Two Sum in Javascript', points: '50 pts', page: '/practice/two-sum' },
    { id: 'chal-2', task: 'Review Operating System Closures & Processes', points: '30 pts', page: '/tutor' },
    { id: 'chal-3', task: 'Audit your Resume for structural verbs', points: '40 pts', page: '/resume' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-2xl border border-slate-800/40 relative overflow-hidden shadow-lg shadow-slate-950/10">
        <div className="absolute -right-8 -bottom-10 w-44 h-44 bg-primary-600/10 rounded-full filter blur-[40px] animate-pulse"></div>
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/15 border border-primary-550/30 text-primary-400 rounded-full text-xs font-bold mb-4">
            🔥 Placement Readiness Chamber
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Ready to pass your coding screening, {user?.name}?
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            Your current roadmap progress is pacing in the top 15% of your class. Practice today's daily coding challenge to maintain your streak.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{card.value}</h3>
              <p className="text-xs text-slate-400 mt-1">{card.desc}</p>
            </div>
            <div className={`p-3 rounded-xl border ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Analytics Chart & Challenges */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Interview Evaluation Trend</h3>
                <p className="text-xs text-slate-400 mt-0.5">Average mock performance progression</p>
              </div>
              <Calendar size={16} className="text-slate-400" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={interviewHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#7c3aed" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Challenges */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4">Today's Practice Checklist</h3>
            <div className="space-y-3">
              {dailyChallenges.map((challenge, index) => (
                <div 
                  key={challenge.id} 
                  onClick={() => navigate(challenge.page)}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/20 hover:border-primary-500/30 rounded-xl cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{challenge.task}</p>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1.5 inline-block">{challenge.points}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Roadmaps & Shortcuts */}
        <div className="space-y-6">
          {/* Circular Roadmaps Widget */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-4">Current Track Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">Data Structures & Algorithms</span>
                  <span className="text-primary-600 dark:text-primary-400">40% Complete</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">MERN Stack Development</span>
                  <span className="text-primary-600 dark:text-primary-400">25% Complete</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">System Design Fundamentals</span>
                  <span className="text-primary-600 dark:text-primary-400">60% Complete</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full glow-primary" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/roadmaps')}
              className="mt-6 flex items-center justify-center gap-1.5 w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/40 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-xl transition"
            >
              <span>Explore Personalized Roadmaps</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-2">Chamber Shortcuts</h3>
            
            <div 
              onClick={() => navigate('/tutor')}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/20 hover:bg-primary-600/5 dark:hover:bg-primary-650/10 rounded-xl cursor-pointer group"
            >
              <div className="p-2.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg group-hover:scale-105 transition-all">
                <BookOpen size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Consult AI Tutor</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Concept explanations & coding helper modes</p>
              </div>
            </div>

            <div 
              onClick={() => navigate('/resume')}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/20 hover:bg-primary-600/5 dark:hover:bg-primary-650/10 rounded-xl cursor-pointer group"
            >
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-105 transition-all">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">ATS Resume Scanner</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Verify ATS score, missing skills & optimize</p>
              </div>
            </div>

            <div 
              onClick={() => navigate('/interview')}
              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/20 hover:bg-primary-600/5 dark:hover:bg-primary-650/10 rounded-xl cursor-pointer group"
            >
              <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-105 transition-all">
                <MessageSquare size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Mock Interview</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Test Technical, HR, and Aptitude rounds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
