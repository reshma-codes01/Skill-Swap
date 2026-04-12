import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Sun, Moon, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Explore', href: '/explore' },
  { name: 'Inbox', href: '/inbox', protected: true },
  { name: 'Requests', href: '/requests', protected: true },
];

export default function Navbar({ onLoginClick, onCreateClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Dynamic user display
  const userName = user?.name || 'User';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff&size=100`;
  
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // default dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer outline-none group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="p-1.5 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg text-white shadow-md"
            >
              <Zap size={24} fill="currentColor" className="text-white" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 border-b-2 border-transparent group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              SkillSwap
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 relative">
            {navLinks.filter(link => !link.protected || isAuthenticated).map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `text-sm font-medium transition-colors relative group px-1 pb-1 outline-none ${isActive ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border-b-2 border-transparent hover:border-indigo-500/50'}`}
              >
                {link.name}
              </NavLink>
            ))}
            
            <button
               onClick={() => setIsDark(!isDark)}
               className="p-2 ml-2 justify-center items-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
               aria-label="Toggle Theme"
            >
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <>
                <div className="mr-2">
                  <NotificationBell />
                </div>
                <motion.button
                  onClick={onCreateClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transition-all focus:outline-none z-10"
                >
                  <Plus size={16} strokeWidth={3} /> Post a Skill
                </motion.button>
                
                <Link to="/profile" className="flex items-center justify-center outline-none group ml-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 shadow-sm transition-all focus:ring-2 focus:ring-indigo-500">
                     <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="h-5 w-px bg-zinc-300 dark:bg-zinc-700 mx-1"></div>
                <button
                  onClick={handleLogout}
                  className="px-2 py-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors focus:outline-none"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <motion.button
                onClick={onLoginClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 text-sm font-semibold rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-md transition-all focus:outline-none"
              >
                Join / Login
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {isAuthenticated && <NotificationBell />}
            <button
               onClick={() => setIsDark(!isDark)}
              className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.filter(link => !link.protected || isAuthenticated).map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `block px-3 py-3 text-base font-medium rounded-md transition-colors outline-none ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50'}`}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-4 px-2 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors border border-zinc-200 dark:border-zinc-800 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{userName}</span>
                        <span className="text-zinc-500 text-xs font-semibold">View Profile</span>
                      </div>
                    </Link>
                    <button 
                      onClick={() => { onCreateClick(); setIsOpen(false); }}
                      className="w-full flex justify-center items-center gap-2 px-5 py-3 text-base font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] transition-all focus:outline-none"
                    >
                      <Plus size={18} strokeWidth={3} /> Post a Skill
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full px-5 py-3 text-base font-semibold rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:outline-none"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                    className="w-full px-5 py-3 text-base font-semibold rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 transition-all shadow-md focus:outline-none"
                  >
                    Join / Login
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
