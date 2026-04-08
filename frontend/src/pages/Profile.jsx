import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Edit3, ArrowRightLeft, Star, Clock } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const tabs = ['My Swaps', 'Saved', 'Connections'];

const mySwapsData = [
  { id: 1, name: "Jitender Kumar", avatarColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400", offering: "MERN Stack Dev", lookingFor: "Advanced UI/UX", rating: 5.0, time: "2h ago" },
  { id: 2, name: "Jitender Kumar", avatarColor: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400", offering: "REST APIs", lookingFor: "Figma Prototyping", rating: 5.0, time: "1d ago" },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <PageWrapper>
      <div className="flex flex-col w-full min-h-screen relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cover Banner & Profile Header */}
        <div className="relative mb-16 md:mb-20">
          {/* Cover Banner */}
          <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
            <div className="absolute top-4 right-4">
               <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold transition-colors focus:outline-none">
                 <Edit3 size={16} /> Edit Cover
               </button>
            </div>
          </div>

          {/* Overlapping Avatar & Info */}
          <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 overflow-hidden shadow-2xl shadow-indigo-500/20">
                <img src={`https://ui-avatars.com/api/?name=Jitender+Kumar&background=6366f1&color=fff&size=200`} alt="Jitender Kumar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-lg"></div>
            </div>
            
            <div className="ml-6 mb-2 hidden md:block">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white drop-shadow-md">Jitender Kumar</h1>
              <p className="text-zinc-100 font-medium drop-shadow-md opacity-90 text-lg mt-1">BCA Final Year | Full-Stack MERN Developer</p>
            </div>
          </div>
        </div>

        {/* Mobile Info View */}
        <div className="md:hidden mt-20 px-2 mb-8">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">Jitender Kumar</h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium mt-1">BCA Final Year | Full-Stack MERN Developer</p>
        </div>

        {/* Details & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300 font-semibold md:pl-[220px] mb-12 px-2 md:px-0">
           <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md self-start shadow-sm">
             <MapPin size={18} className="text-indigo-500" /> Delhi Campus
           </div>
           <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md self-start shadow-sm">
             <Calendar size={18} className="text-purple-500" /> Joined March 2026
           </div>
        </div>

        {/* Tabs System */}
        <div className="flex space-x-8 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 text-base font-bold transition-colors whitespace-nowrap outline-none px-2 ${
                activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabIndicatorProfile"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'My Swaps' && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
                {mySwapsData.map((swap) => (
                   <motion.div 
                     key={swap.id}
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

                       {/* Action */}
                       <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-end">
                          <button className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm focus:outline-none">
                            Edit Swap
                          </button>
                       </div>
                   </motion.div>
                ))}
             </motion.div>
          )}

          {activeTab === 'Saved' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                <Star size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg text-zinc-800 dark:text-zinc-200">No saved swaps yet.</p>
                <p className="text-sm mt-2 text-zinc-500">Explore the board and save swaps that match your goals.</p>
             </motion.div>
          )}

          {activeTab === 'Connections' && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                <MapPin size={48} className="mb-4 opacity-50" />
                <p className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Your network is empty.</p>
                <p className="text-sm mt-2 text-zinc-500">Complete a swap to start building your campus network!</p>
             </motion.div>
          )}
        </div>

      </div>
      </div>
    </PageWrapper>
  );
}
