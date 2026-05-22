import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  Users, 
  Terminal, 
  PlayCircle, 
  Trash2, 
  UserCheck, 
  BarChart4,
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const AdminPanel = () => {
  const [metrics, setMetrics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  const fetchAdminDashboard = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const analyticsRes = await axios.get('/api/admin/analytics');
      const usersRes = await axios.get('/api/admin/users');

      if (analyticsRes.data.success && usersRes.data.success) {
        setMetrics(analyticsRes.data);
        setUsersList(usersRes.data.users);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Unauthorized admin request.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      const { data } = await axios.put(`/api/admin/users/${userId}`);
      if (data.success) {
        // Reload dashboard
        fetchAdminDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating administrator rights.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user profile? This action is irreversible.')) return;
    try {
      const { data } = await axios.delete(`/api/admin/users/${userId}`);
      if (data.success) {
        fetchAdminDashboard();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting user.');
    }
  };

  // Recharts colors
  const COLORS = ['#7c3aed', '#10b981', '#3b82f6', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-10 h-10 border-4 border-primary-650 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-400 font-semibold tracking-wider uppercase animate-pulse">Loading system log metrics...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-center max-w-md mx-auto space-y-3">
        <ShieldAlert size={36} className="mx-auto" />
        <h3 className="font-bold text-sm">Access Restricted</h3>
        <p className="text-xs">{errorMsg}</p>
      </div>
    );
  }

  // Formatting chart data
  const pieData = metrics ? Object.entries(metrics.languages).map(([key, val]) => ({
    name: key.toUpperCase(),
    value: val
  })).filter(item => item.value > 0) : [];

  // Fallback pie data if empty
  const defaultPieData = [
    { name: 'JAVASCRIPT', value: 45 },
    { name: 'PYTHON', value: 30 },
    { name: 'C++', value: 15 },
    { name: 'JAVA', value: 10 }
  ];

  const activePieData = pieData.length > 0 ? pieData : defaultPieData;

  const barData = metrics ? Object.entries(metrics.interviews.types).map(([key, val]) => ({
    name: key,
    Audits: val,
    AvgScore: metrics.interviews.averages[key] || 0
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Admin Control Center</h1>
          <p className="text-xs text-slate-400 mt-1">Monitor platform usage metrics and manage CSE student accounts.</p>
        </div>
        <button
          onClick={fetchAdminDashboard}
          className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
        >
          <RefreshCw size={14} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{metrics.metrics.totalUsers}</h4>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Award size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mocks Conducted</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{metrics.metrics.totalInterviews}</h4>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <PlayCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Practice Submissions</p>
              <h4 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{metrics.metrics.totalSubmissions}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Charts Grid */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mocks analysis bar chart */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm mb-4">Interviews Audited by Category</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend fontSize={10} />
                  <Bar dataKey="Audits" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="AvgScore" name="Avg Score %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Languages Pie chart */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm flex flex-col justify-between">
            <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm mb-4">Practice Language Popularity</h3>
            <div className="h-56 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '12px', 
                      border: '1px solid #1e293b',
                      color: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Pie Legend */}
            <div className="flex justify-center gap-4 flex-wrap text-[10px] font-bold text-slate-400 mt-2">
              {activePieData.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Management list */}
      <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl shadow-sm">
        <h3 className="font-bold text-slate-850 dark:text-slate-200 text-sm mb-4">Registered CSE Student Registry</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-4">Student Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Join Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((usr) => (
                <tr key={usr._id} className="border-b border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">{usr.name}</h4>
                      <p className="text-[10px] text-slate-450 mt-0.5">{usr.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${
                      usr.isAdmin 
                        ? 'bg-purple-500/10 text-purple-650 dark:text-purple-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450'
                    }`}>
                      {usr.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                    🔥 {usr.streak || 0}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(usr.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleAdmin(usr._id)}
                        className="p-1.5 text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
                        title={usr.isAdmin ? "Demote to User" : "Promote to Admin"}
                      >
                        <UserCheck size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(usr._id)}
                        className="p-1.5 text-slate-400 hover:text-red-650 transition"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
