import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Edit3, ArrowRightLeft, Star, Clock, Loader2, AlertCircle, FileText, Trash2, Bookmark, MessageCircle, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import EditProfileModal from '../components/EditProfileModal';
import EditSwapModal from '../components/EditSwapModal';
import API from '../api';

const tabs = ['My Swaps', 'Saved', 'Connections'];

// Helpers
const formatJoinDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return `Joined ${date.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [user, setUser] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingSwap, setEditingSwap] = useState(null);

  // Saved & Connections state
  const [savedSwaps, setSavedSwaps] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, swapsRes] = await Promise.all([
          API.get('/auth/profile'),
          API.get('/swaps/me'),
        ]);
        setUser(profileRes.data);
        setSwaps(swapsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // Fetch Saved Swaps when tab activates
  useEffect(() => {
    if (activeTab === 'Saved') {
      setSavedLoading(true);
      API.get('/auth/saved')
        .then(res => setSavedSwaps(res.data))
        .catch(() => toast.error('Failed to load saved swaps'))
        .finally(() => setSavedLoading(false));
    }
  }, [activeTab]);

  // Fetch Connections when tab activates
  useEffect(() => {
    if (activeTab === 'Connections') {
      setConnectionsLoading(true);
      API.get('/auth/connections')
        .then(res => setConnections(res.data))
        .catch(() => toast.error('Failed to load connections'))
        .finally(() => setConnectionsLoading(false));
    }
  }, [activeTab]);

  // Callback after profile is updated via modal
  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser);
  };

  // Callback after swap is updated via modal
  const handleSwapUpdated = (updatedSwap) => {
    setSwaps(prev => prev.map(s => s._id === updatedSwap._id ? updatedSwap : s));
  };

  // Handle swap deletion
  const handleDeleteSwap = async (swapId) => {
    if (!window.confirm('Are you sure you want to delete this swap?')) return;

    try {
      await API.delete(`/swaps/${swapId}`);
      setSwaps(prev => prev.filter(s => s._id !== swapId));
      toast.success('Swap deleted successfully 🗑️');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete swap');
    }
  };

  // Handle unsave from Saved tab
  const handleUnsave = async (swapId) => {
    try {
      await API.post(`/auth/save/${swapId}`);
      setSavedSwaps(prev => prev.filter(s => s._id !== swapId));
      toast.success('Swap removed from saved');
    } catch (error) {
      toast.error('Failed to unsave');
    }
  };

  // Loading State
  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 size={40} className="animate-spin text-indigo-500" />
          <p className="text-zinc-500 dark:text-zinc-400 font-semibold text-lg">Loading profile...</p>
        </div>
      </PageWrapper>
    );
  }

  // Error State
  if (error) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertCircle size={48} className="text-red-500/70" />
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Please log in and try again.</p>
        </div>
      </PageWrapper>
    );
  }

  // Dynamic values
  const userName = user?.name || 'User';
  const userEmail = user?.college_email || '';
  const userBio = user?.bio || '';
  const userLocation = user?.location || '';
  const joinDate = formatJoinDate(user?.createdAt);
  const displayAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff&size=200`;

  return (
    <PageWrapper>
      <div className="flex flex-col w-full min-h-screen relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Cover Banner & Profile Header */}
        <div className="relative mb-16 md:mb-20">
          <div className="w-full h-48 md:h-64 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden relative shadow-lg">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
            <div className="absolute top-4 right-4">
               <button 
                 onClick={() => setEditOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white text-sm font-semibold transition-colors focus:outline-none"
               >
                 <Edit3 size={16} /> Edit Profile
               </button>
            </div>
          </div>

          <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-zinc-50 dark:border-zinc-950 bg-zinc-200 dark:bg-zinc-800 overflow-hidden shadow-2xl shadow-indigo-500/20">
                <img src={displayAvatar} alt={userName} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full shadow-lg"></div>
            </div>
            
            <div className="ml-6 mb-2 hidden md:block">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white drop-shadow-md">{userName}</h1>
              <p className="text-zinc-100 font-medium drop-shadow-md opacity-90 text-lg mt-1">
                {userBio || userEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Info View */}
        <div className="md:hidden mt-20 px-2 mb-8">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{userName}</h1>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium mt-1">
              {userBio || userEmail}
            </p>
        </div>

        {/* Bio Section */}
        {userBio && (
          <div className="hidden md:flex items-start gap-3 md:pl-[220px] mb-6 px-2 md:px-0">
            <div className="flex items-start gap-2 bg-white/70 dark:bg-zinc-900/60 px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md shadow-sm max-w-2xl">
              <FileText size={18} className="text-indigo-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{userBio}</p>
            </div>
          </div>
        )}

        {/* Details & Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300 font-semibold md:pl-[220px] mb-12 px-2 md:px-0">
           {userLocation && (
             <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md self-start shadow-sm">
               <MapPin size={18} className="text-indigo-500" /> {userLocation}
             </div>
           )}
           <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md self-start shadow-sm">
             <Calendar size={18} className="text-purple-500" /> {joinDate}
           </div>
           <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-md self-start shadow-sm">
             <Star size={18} className="text-amber-500" /> {swaps.length} {swaps.length === 1 ? 'Swap' : 'Swaps'} Posted
           </div>
        </div>

        {/* Tabs */}
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
          {/* ===== MY SWAPS TAB ===== */}
          {activeTab === 'My Swaps' && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
               {swaps.length === 0 ? (
                 <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                   <ArrowRightLeft size={48} className="mb-4 opacity-50" />
                   <p className="font-bold text-lg text-zinc-800 dark:text-zinc-200">No swaps posted yet.</p>
                   <p className="text-sm mt-2 text-zinc-500">Post your first skill swap to get started!</p>
                 </div>
               ) : (
                 swaps.map((swap) => (
                   <motion.div 
                     key={swap._id}
                     whileHover={{ y: -5 }}
                     className="group relative bg-white/70 dark:bg-zinc-900 backdrop-blur-md border border-white/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
                   >
                       <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-lg shadow-sm bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                             {getInitials(swap.postedBy?.name || userName)}
                           </div>
                           <div>
                             <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">{swap.postedBy?.name || userName}</h3>
                             <div className="flex items-center text-[12px] text-zinc-500 dark:text-zinc-500 gap-1.5 mt-0.5">
                                <span className="flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">{swap.status}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {timeAgo(swap.createdAt)}</span>
                             </div>
                           </div>
                         </div>
                       </div>

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

                       <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-end gap-2">
                          <button 
                            onClick={() => handleDeleteSwap(swap._id)}
                            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all shadow-sm focus:outline-none"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                          <button 
                            onClick={() => setEditingSwap(swap)}
                            className="px-6 py-2.5 text-xs font-bold rounded-xl bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all shadow-sm focus:outline-none"
                          >
                            Edit Swap
                          </button>
                       </div>
                   </motion.div>
                 ))
               )}
             </motion.div>
          )}

          {/* ===== SAVED TAB ===== */}
          {activeTab === 'Saved' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {savedLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="text-zinc-500 font-semibold">Loading saved swaps...</p>
                </div>
              ) : savedSwaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                  <Bookmark size={48} className="mb-4 opacity-50" />
                  <p className="font-bold text-lg text-zinc-800 dark:text-zinc-200">No saved swaps yet.</p>
                  <p className="text-sm mt-2 text-zinc-500">Explore the board and save swaps that match your goals.</p>
                  <Link to="/explore" className="mt-6 px-6 py-2.5 text-sm font-bold bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-md">
                    Browse Swaps
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedSwaps.map((swap) => (
                    <motion.div 
                      key={swap._id}
                      whileHover={{ y: -5 }}
                      className="group relative bg-white/70 dark:bg-zinc-900 backdrop-blur-md border border-white/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-lg shadow-sm bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                            {getInitials(swap.postedBy?.name)}
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-[16px] tracking-tight">{swap.postedBy?.name || 'Unknown'}</h3>
                            <span className="flex items-center gap-1 text-[12px] font-medium text-zinc-500"><Clock size={12} /> {timeAgo(swap.createdAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 flex-1">
                        <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Offering ({swap.offerCategory})</p>
                          <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.offerSkill}</p>
                        </div>
                        <div className="flex justify-center -my-2 relative z-10">
                          <div className="bg-white/90 dark:bg-zinc-900 p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-400 shadow-md">
                            <ArrowRightLeft size={16} />
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/60 dark:bg-zinc-950/50 border border-white/50 dark:border-zinc-800 shadow-sm">
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Looking For ({swap.seekCategory})</p>
                          <p className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-200">{swap.seekSkill}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-200/50 dark:border-zinc-800 flex justify-end">
                        <button 
                          onClick={() => handleUnsave(swap._id)}
                          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all shadow-sm"
                        >
                          <Bookmark size={14} className="fill-indigo-500 text-indigo-500" /> Unsave
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ===== CONNECTIONS TAB ===== */}
          {activeTab === 'Connections' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {connectionsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                  <p className="text-zinc-500 font-semibold">Loading connections...</p>
                </div>
              ) : connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400 dark:text-zinc-500">
                  <Users size={48} className="mb-4 opacity-50" />
                  <p className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Your network is empty.</p>
                  <p className="text-sm mt-2 text-zinc-500">Complete a swap to start building your campus network!</p>
                  <Link to="/explore" className="mt-6 px-6 py-2.5 text-sm font-bold bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors shadow-md">
                    Start Swapping
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {connections.map((conn) => {
                    const connAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(conn.name)}&background=6366f1&color=fff&size=120`;
                    return (
                      <motion.div 
                        key={conn._id}
                        whileHover={{ y: -4 }}
                        className="bg-white/70 dark:bg-zinc-900 backdrop-blur-md border border-white/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-xl shadow-indigo-500/5 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-md flex-shrink-0">
                            <img src={connAvatar} alt={conn.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg tracking-tight truncate">{conn.name}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium truncate">{conn.college_email}</p>
                          </div>
                        </div>

                        {conn.bio && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">{conn.bio}</p>
                        )}

                        <Link
                          to="/inbox"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold rounded-xl bg-zinc-900 text-white dark:bg-indigo-600 hover:opacity-90 transition-all shadow-md"
                        >
                          <MessageCircle size={16} /> Message
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

      </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setEditOpen(false)} 
        currentUser={user} 
        onProfileUpdated={handleProfileUpdated} 
      />

      {/* Edit Swap Modal */}
      <EditSwapModal 
        isOpen={!!editingSwap} 
        onClose={() => setEditingSwap(null)} 
        swap={editingSwap} 
        onSwapUpdated={handleSwapUpdated} 
      />
    </PageWrapper>
  );
}
