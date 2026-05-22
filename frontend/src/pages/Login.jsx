import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-sans">
      {/* Left side: Form */}
      <div className="flex flex-col justify-center w-full px-6 py-12 lg:w-[480px] xl:w-[540px] bg-slate-950/70 backdrop-blur-md z-10">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-500 shadow-lg shadow-primary-500/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl bg-gradient-to-r from-primary-500 to-indigo-400 bg-clip-text text-transparent">EduAI</h1>
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-bold">Smart Placement Assistant</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Step back into your AI-guided preparation chamber.</p>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-primary-550 focus:ring-1 focus:ring-primary-550 focus:outline-none transition-all placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl focus:border-primary-550 focus:ring-1 focus:ring-primary-550 focus:outline-none transition-all placeholder:text-slate-600 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-primary-650/10 hover:shadow-primary-650/20 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-bold transition">
              Create free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: Illustration Panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-950 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-600/20 rounded-full filter blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/15 rounded-full filter blur-[70px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Feature Cards Grid */}
        <div className="relative z-10 max-w-lg text-center px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-950/40 border border-primary-800/30 text-primary-400 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] font-bold tracking-wider uppercase">Now with Mock Voice Reviews</span>
          </div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Accelerate your engineering journey.
          </h2>
          <p className="text-slate-400 text-base mb-8 leading-relaxed">
            Get personalized roadmaps, run DSA code in sandboxes, perform voice-activated mock interviews, and optimize your resume with detailed ATS reports.
          </p>

          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-slate-200 mt-2">Sandboxed Compiler</h3>
              <p className="text-xs text-slate-500 mt-1">Run JS instantly and validate C++, Java, and Python logic.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800/50 rounded-2xl">
              <span className="text-2xl">🎯</span>
              <h3 className="font-bold text-sm text-slate-200 mt-2">ATS Resume Scanners</h3>
              <p className="text-xs text-slate-500 mt-1">Get precise ATS analysis and tailored project suggestions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
