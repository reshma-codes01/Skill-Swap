import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Star, Clock } from 'lucide-react';
import API from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

const colors = ['indigo', 'purple', 'zinc', 'blue', 'rose', 'emerald'];
const getAvatarColor = (index) => {
  const color = colors[index % colors.length];
  return `bg-${color}-100 text-${color}-600 dark:bg-${color}-500/20 dark:text-${color}-400`;
};

const timeAgo = (dateStr) => {
  const diff = new Date() - new Date(dateStr);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function SkillFeed({ searchQuery = '', activeCategory = 'All', sortOrder = 'newest' }) {
  const [swaps, setSwaps] = useState([]);
  const [filteredSwaps, setFilteredSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const { data } = await API.get('/swaps');
        setSwaps(data);
        setFilteredSwaps(data);
      } catch (error) {
        console.error("Failed to fetch swaps:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSwaps();
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = swaps.filter((swap) => {
      const offerSkill = (swap.offerSkill ?? '').toLowerCase();
      const seekSkill = (swap.seekSkill ?? '').toLowerCase();
      const offerCategory = swap.offerCategory ?? '';
      const seekCategory = swap.seekCategory ?? '';

      const matchesSearch =
        query.length === 0 || offerSkill.includes(query) || seekSkill.includes(query);

      const matchesCategory =
        activeCategory === 'All' ||
        offerCategory === activeCategory ||
        seekCategory === activeCategory;

      return matchesSearch && matchesCategory;
    });

    result = result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredSwaps(result);
  }, [swaps, searchQuery, activeCategory, sortOrder]);

  return (
    <section className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16 relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Trending Swaps
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-lg"
        >
          Discover what students are exchanging right now. Match your skills with someone looking for exactly what you offer on the Live Barter Board.
        </motion.p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/40 rounded-3xl p-6 h-[280px] animate-pulse">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-[1rem] bg-indigo-100 dark:bg-zinc-800"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-900 rounded"></div>
                </div>
              </div>
              <div className="space-y-4 mt-4">
                <div className="h-16 w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800"></div>
                <div className="h-16 w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredSwaps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col justify-center py-20 items-center text-zinc-500"
        >
          <div className="bg-zinc-100 dark:bg-zinc-900 p-4 rounded-full mb-4">
            <ArrowRightLeft className="w-12 h-12 text-zinc-400 opacity-50" />
          </div>
          <p className="text-xl font-bold text-zinc-800 dark:text-zinc-200">No swaps found</p>
          <p className="text-sm mt-2 max-w-sm text-center">Try adjusting your search terms or selecting a different category to find what you're looking for.</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSwaps.map((swap, index) => (
            <motion.div
              key={swap._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group relative bg-white/70 dark:bg-zinc-900 backdrop-blur-md border border-white/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-lg shadow-sm ${getAvatarColor(index)}`}>
                    {swap.postedBy?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">{swap.postedBy?.name || 'Unknown'}</h3>
                    <div className="flex items-center text-[12px] text-zinc-500 dark:text-zinc-500 gap-1.5 mt-0.5">
                      <span className="flex items-center gap-1 font-semibold"><Star size={12} className="text-zinc-400" /> 5.0</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {timeAgo(swap.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Exchange Info */}
              <div className="space-y-3 flex-1">
                <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Offering ({swap.offerCategory})</p>
                  <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.offerSkill}</p>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-white/90 dark:bg-zinc-900 p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shadow-md">
                    <ArrowRightLeft size={16} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Looking For ({swap.seekCategory})</p>
                  <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.seekSkill}</p>
                </div>
              </div>

              {/* Card Action */}
              <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-between items-center">
                <button className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  View Profile
                </button>
                <button className="px-5 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-md">
                  Swap Skills
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
