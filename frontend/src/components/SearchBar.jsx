import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const categories = ['All', 'Coding', 'Design', 'Music', 'Languages', 'Fitness', 'Photography', 'Math', 'Writing', 'Finance'];

export default function SearchBar() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <section className="pt-2 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10 w-full">
      {/* Search Input */}
      <div className="relative group mb-8">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10">
          <Search size={22} />
        </div>
        <input
          type="text"
          className="block w-full pl-14 pr-6 py-4 md:py-5 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/40 shadow-xl shadow-zinc-200/50 dark:shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all text-lg peer"
          placeholder="What skill do you want to learn today?"
        />
        {/* Glow effect behind input on focus */}
        <div className="absolute inset-0 bg-transparent peer-focus:bg-indigo-400/10 dark:peer-focus:bg-indigo-500/10 rounded-2xl transition-colors pointer-events-none -z-10 blur-xl"></div>
      </div>

      {/* Filter Pills */}
      <div className="relative w-full overflow-hidden">
        {/* Fade gradients for scroll edges to smoothly blend with background */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-zinc-50 dark:from-zinc-950 to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex space-x-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide snap-x">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm snap-start ${
                  isActive 
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md ring-2 ring-transparent dark:ring-white/20' 
                  : 'bg-white/80 text-zinc-600 border border-zinc-200 hover:border-zinc-300 hover:text-zinc-900 dark:bg-zinc-900/60 dark:text-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200 backdrop-blur-md'
                }`}
              >
                {category}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
