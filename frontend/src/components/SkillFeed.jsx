import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Star, Clock } from 'lucide-react';

const swaps = [
  { id: 1, name: "Alex Dev", avatarColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400", offering: "React Frontend", lookingFor: "UX/UI Design Mockups", rating: 4.9, time: "2h ago" },
  { id: 2, name: "Sarah Design", avatarColor: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400", offering: "Figma Prototyping", lookingFor: "Python Scripting", rating: 5.0, time: "5h ago" },
  { id: 3, name: "Marcus Music", avatarColor: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400", offering: "Guitar Lessons", lookingFor: "College Algebra", rating: 4.8, time: "1d ago" },
  { id: 4, name: "Elena Math", avatarColor: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400", offering: "Calculus & Linear Algebra", lookingFor: "Conversational Spanish", rating: 4.9, time: "1d ago" },
  { id: 5, name: "David Lang", avatarColor: "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400", offering: "Fluent Spanish", lookingFor: "Video Editing", rating: 4.7, time: "2d ago" },
  { id: 6, name: "Chloe Video", avatarColor: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400", offering: "Video Production", lookingFor: "SEO & Content Writing", rating: 5.0, time: "2d ago" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } }
};

export default function SkillFeed() {
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

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {swaps.map((swap) => (
          <motion.div 
            key={swap.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="group relative bg-white/70 dark:bg-zinc-900 backdrop-blur-md border border-white/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
          >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-lg shadow-sm ${swap.avatarColor}`}>
                    {swap.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">{swap.name}</h3>
                    <div className="flex items-center text-[12px] text-zinc-500 dark:text-zinc-500 gap-1.5 mt-0.5">
                       <span className="flex items-center gap-1 font-semibold"><Star size={12} className="text-zinc-400" /> {swap.rating}</span>
                       <span>•</span>
                       <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {swap.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Exchange Info */}
              <div className="space-y-3 flex-1">
                <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Offering</p>
                  <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.offering}</p>
                </div>
                
                <div className="flex justify-center -my-2 relative z-10">
                  <div className="bg-white/90 dark:bg-zinc-900 p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors shadow-md">
                    <ArrowRightLeft size={16} />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase font-bold tracking-widest mb-1">Looking For</p>
                  <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.lookingFor}</p>
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
    </section>
  );
}
