import { Zap, Globe, Share2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onLoginClick, onCreateClick }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGuardedAction = (action, destination) => {
    if (!isAuthenticated) {
      onLoginClick();
    } else {
      if (action === 'modal') {
        onCreateClick();
      } else if (action === 'navigate') {
        navigate(destination);
      }
    }
  };

  return (
    <footer className="w-full bg-zinc-50/50 dark:bg-zinc-950/20 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pt-16 pb-8 relative z-20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link to="/" className="flex items-center gap-2 mb-4 group cursor-pointer outline-none">
              <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                SkillSwap
              </span>
            </Link>
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 max-w-xs">
              The premier platform for college students to exchange skills, build networks, and grow together without spending a dime.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-wide uppercase text-xs">Platform</h4>
            <div className="flex flex-col space-y-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              <Link to="/explore" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Explore Swaps</Link>
              <button 
                onClick={() => handleGuardedAction('modal')}
                className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
              >
                Post a Skill
              </button>
              <button 
                onClick={() => handleGuardedAction('navigate', '/inbox')}
                className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
              >
                Inbox
              </button>
              <button 
                onClick={() => handleGuardedAction('navigate', '/requests')}
                className="text-left hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none"
              >
                Requests
              </button>
            </div>
          </div>

          {/* Column 3: Social & Legal */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-wide uppercase text-xs">Connect</h4>
             <div className="flex space-x-4 mb-6">
                <a href="#" className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all focus:outline-none">
                  <Globe size={18} />
                </a>
                <a href="#" className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all focus:outline-none">
                  <Share2 size={18} />
                </a>
                <a href="#" className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-400/50 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all focus:outline-none">
                  <Mail size={18} />
                </a>
             </div>
             <div className="flex space-x-4 text-xs font-bold text-zinc-400 dark:text-zinc-500">
               <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Privacy</Link>
               <span>•</span>
               <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Terms</Link>
             </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-600 opacity-80 flex items-center">
            Built with <span className="text-rose-500 mx-1.5 animate-pulse text-lg">❤️</span> for Campus
          </p>
          <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-600 mt-2 opacity-50">
            © 2026 SkillSwap Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
