import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  Code2, 
  Map, 
  Shield, 
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, isAdmin, handleLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Tutor', path: '/tutor', icon: BookOpen },
    { name: 'Mock Interview', path: '/interview', icon: MessageSquare },
    { name: 'Resume Analyzer', path: '/resume', icon: FileText },
    { name: 'Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Coding Practice', path: '/practice', icon: Code2 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  const activeStyle = "flex items-center gap-3 px-4 py-3 bg-primary-600 text-white rounded-xl shadow-md glow-primary transition-all duration-200";
  const inactiveStyle = "flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-950 dark:hover:text-white rounded-xl transition-all duration-200";

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200/50 dark:border-slate-800/40 bg-white dark:bg-slate-950 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        {/* Brand Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-200/50 dark:border-slate-800/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 text-white shadow-md">
            <GraduationCap size={22} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">EduAI</h1>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Tutor & Interviewer</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
