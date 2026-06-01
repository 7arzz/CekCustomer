import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Plus
} from 'lucide-react';
import { cn } from '../utils/cn';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 h-screen">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
            CRM Freelancer
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                location.pathname === item.path
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40">
        <h1 className="text-xl font-bold text-primary-600">CRM Freelancer</h1>
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Bottom Nav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-4 z-40 pb-safe">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all",
              location.pathname === item.path
                ? "text-primary-600 dark:text-primary-400"
                : "text-slate-400 dark:text-slate-500"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Add Padding for Mobile Bottom Nav */}
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
