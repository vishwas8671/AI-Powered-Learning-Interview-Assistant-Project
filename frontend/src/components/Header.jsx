import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sun, Moon, Flame, Menu, Bell } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  const { user, theme, toggleTheme } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 glass-panel border-b border-slate-200/50 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/80">
      {/* Left side: Menu trigger for mobile */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Welcome back,</p>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name || 'Academic Scholar'}</h2>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-4">
        {/* Streak Counter */}
        {user && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 rounded-full select-none shadow-sm animate-bounce">
            <Flame size={16} fill="currentColor" />
            <span className="text-xs font-bold">{user.streak} Day Streak</span>
          </div>
        )}

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Quick notification bell */}
        <button className="relative p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-550 rounded-full animate-ping"></span>
        </button>

        {/* User avatar bubble */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-950/50 border border-primary-300/30 dark:border-primary-800/30 text-primary-600 dark:text-primary-400 font-bold text-sm shadow-sm select-none">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;
