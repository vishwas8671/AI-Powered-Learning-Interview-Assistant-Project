import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  User, 
  Mail, 
  Calendar, 
  Bookmark, 
  FileText, 
  Settings, 
  CheckCircle2, 
  Code2, 
  Award,
  BookOpen
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, bookmarks, notes, toggleBookmark } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  
  // States
  const [updateMsg, setUpdateMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('bookmarks'); // bookmarks, notes, settings
  const [userAnalytics, setUserAnalytics] = useState(null);

  // Sync profile details when user context loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Load latest analytics
  useEffect(() => {
    const fetchProfileAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/auth/profile');
        if (data.success) {
          setUserAnalytics(data.analytics);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchProfileAnalytics();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateMsg('');
    setErrorMsg('');

    const res = await updateProfile(name, email, password);
    if (res.success) {
      setUpdateMsg('Profile updated successfully.');
      setPassword('');
    } else {
      setErrorMsg(res.message || 'Failed to update profile.');
    }
  };

  const formattedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'October 2024';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-250/20 flex items-center justify-center text-3xl font-bold select-none">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="space-y-1.5 text-center md:text-left flex-grow">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{user?.name}</h2>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Mail size={14} /> {user?.email}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Member since {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-center">
          <Code2 size={20} className="text-primary-500 mx-auto mb-2" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Problems Solved</span>
          <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{userAnalytics?.problemsSolved || 0}</h4>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-center">
          <BookOpen size={20} className="text-primary-500 mx-auto mb-2" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Interviews Completed</span>
          <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{userAnalytics?.interviewsCompleted || 0}</h4>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm text-center">
          <Award size={20} className="text-primary-500 mx-auto mb-2" />
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Interview Score</span>
          <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{userAnalytics?.averageScore || 0}%</h4>
        </div>
      </div>

      {/* Split Control & Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left selector menu */}
        <div className="space-y-4 lg:col-span-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm flex flex-col gap-2">
            {[
              { id: 'bookmarks', name: 'Saved Bookmarks', icon: Bookmark },
              { id: 'notes', name: 'Saved Notes', icon: FileText },
              { id: 'settings', name: 'Profile Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left text-xs font-bold transition ${
                    active 
                      ? 'border-primary-650 bg-primary-600/5 text-primary-650 dark:text-primary-400' 
                      : 'border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right content window */}
        <div className="lg:col-span-2">
          {/* BOOKMARKS TAB */}
          {activeTab === 'bookmarks' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Bookmarked Concepts</h3>
              
              {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bookmarks.map((bm, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">{bm}</span>
                      <button 
                        onClick={() => toggleBookmark(bm)}
                        className="text-[10px] font-bold text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No bookmarked concepts. Consult the AI Tutor and click the bookmark flag to save items.
                </div>
              )}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Saved Study Notes</h3>

              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note._id} className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{note.questionTitle}</h4>
                        <span className="text-[9px] text-slate-400">{new Date(note.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-relaxed">{note.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No saved notes. Write and submit study guides on the AI Tutor panel to list them here.
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3">Manage Profile Details</h3>

              {updateMsg && (
                <div className="p-3 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  {updateMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3 text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Update Password (Leave blank to keep current)</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:border-primary-550 focus:outline-none text-slate-800 dark:text-slate-200 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-750 text-white text-xs font-bold rounded-xl shadow-md transition"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
