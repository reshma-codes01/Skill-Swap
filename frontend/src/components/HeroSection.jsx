import React from 'react';
import { motion } from 'framer-motion';
import { Code2, PenTool, BarChart3, Rocket, Cpu, Globe } from 'lucide-react';

export default function HeroSection() {
  const floatingAnimation = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0]
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const subtleOrbAnimation = {
    animate: {
      y: [0, -30, 0],
      x: [0, 20, -10, 0]
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <main className="pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-600 dark:text-zinc-300 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            SkillSwap Platform v1.1 Minimal
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            <span className="block mb-2">Exchange Skills,</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
              Build Your Campus Network
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed"
          >
            Connect with ambitious students locally. Trade your coding expertise for design help, or teach guitar for math tutoring. A premium barter economy for knowledge.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2"
          >
            <button className="w-full sm:w-auto px-8 py-4 text-lg font-medium rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-zinc-900/20 dark:shadow-none">
              Start Swapping
            </button>
            <button className="w-full sm:w-auto px-8 py-4 text-lg font-medium rounded-full bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-300 shadow-sm">
              Explore Network
            </button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="pt-8 flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-500"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p>Join <span className="text-zinc-900 dark:text-zinc-300 font-semibold">2,000+</span> students already swapping skills.</p>
          </motion.div>
        </div>

        {/* Right Content - Antigravity Visual */}
        <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 perspective-1000">
          {/* Ambient Subtle Orbs */}
          <motion.div 
            {...subtleOrbAnimation}
            className="absolute top-1/4 -right-12 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[60px]"
          />
          <motion.div 
            {...subtleOrbAnimation}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 -left-12 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[60px]"
          />

          {/* Central antigravity object */}
          <motion.div 
            {...floatingAnimation}
            className="relative"
          >
            {/* Diffuse glowing backdrop for light mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-2xl blur-[40px] opacity-30 dark:opacity-0 transform scale-95" />
            
            <div className="relative w-80 h-96 rounded-2xl border border-white/60 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md p-6 shadow-2xl shadow-indigo-500/15 dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden">
              {/* Inner highlight for dark mode */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-400/20 dark:via-zinc-500/20 to-transparent"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex space-x-2 border border-zinc-200/50 dark:border-zinc-800 p-1.5 rounded-full bg-white dark:bg-zinc-950/50 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 dark:bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
                </div>
                <div className="px-2 py-1 rounded text-[10px] font-mono font-medium text-zinc-500 dark:text-zinc-400 bg-white/50 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700 shadow-sm">
                  skill_exchange.jsx
                </div>
              </div>

              <div className="flex-1 mt-6 space-y-4 relative z-10">
                <div className="h-4 w-3/4 rounded bg-zinc-200/80 dark:bg-zinc-800 animate-pulse"></div>
                <div className="h-4 w-full rounded bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '100ms' }}></div>
                <div className="h-4 w-5/6 rounded bg-zinc-200/80 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                
                <div className="mt-8 relative h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 blur-xl rounded-full"></div>
                  <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                      <Globe className="w-20 h-20 text-indigo-400 dark:text-indigo-400/80 drop-shadow-md" strokeWidth={1} />
                  </motion.div>
                </div>
              </div>
              
              <div className="relative z-10 p-4 rounded-xl bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md flex items-center justify-between border border-white dark:border-zinc-800 mt-4 shadow-sm">
                 <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                     <Code2 size={20} />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">System Ready</p>
                     <p className="text-xs text-zinc-500 dark:text-zinc-500">Latency: 12ms</p>
                   </div>
                 </div>
                 <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-transparent flex items-center justify-center shadow-sm">
                   <Rocket size={14} className="text-zinc-500 dark:text-zinc-400" />
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Orbiting Elements */}
          <motion.div 
            animate={{ 
              y: [0, 20, 0], 
              x: [0, -10, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/4 right-[5%] lg:right-[10%] p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/60 dark:border-zinc-800 shadow-xl shadow-indigo-500/10 dark:shadow-none"
          >
            <PenTool className="w-6 h-6 text-purple-500 dark:text-purple-400 drop-shadow-sm" />
          </motion.div>

          <motion.div 
            animate={{ 
              y: [0, -30, 0], 
              x: [0, 15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[15%] left-[0%] lg:left-[5%] p-3.5 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/60 dark:border-zinc-800 shadow-xl shadow-indigo-500/10 dark:shadow-none"
          >
            <BarChart3 className="w-6 h-6 text-indigo-500 dark:text-indigo-400 drop-shadow-sm" />
          </motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, -15, 0], 
              x: [0, -10, 0],
              rotate: [0, -10, 0] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute top-[60%] right-0 p-3 rounded-xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/60 dark:border-zinc-800 shadow-xl shadow-indigo-500/10 dark:shadow-none hidden sm:block"
          >
            <Cpu className="w-5 h-5 text-blue-500 dark:text-indigo-300 drop-shadow-sm" />
          </motion.div>

        </div>
      </div>
    </main>
  );
}
