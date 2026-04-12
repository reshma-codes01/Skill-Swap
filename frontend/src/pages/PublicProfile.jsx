import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MapPin, Star, Clock, ArrowLeft, ArrowRightLeft, ExternalLink, Award } from 'lucide-react';
import API from '../api';
import PageWrapper from '../components/PageWrapper';

const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [userSwaps, setUserSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [profileRes, swapsRes] = await Promise.all([
                    API.get(`/profiles/${id}`),
                    API.get('/swaps')
                ]);
                
                setProfile(profileRes.data);
                // Filter swaps by this user
                setUserSwaps(swapsRes.data.filter(s => s.postedBy._id === id));
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-4">{error || 'Profile not found'}</h2>
                <Link to="/" className="text-indigo-600 hover:underline flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Link */}
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-600 transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Board
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-indigo-500/5"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl font-bold mb-4 shadow-inner">
                                    {profile.name.charAt(0)}
                                </div>
                                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{profile.name}</h1>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 mb-4 flex items-center gap-1.5 justify-center">
                                    <MapPin size={14} /> {profile.location || 'Campus Remote'}
                                </p>
                                
                                <div className="flex items-center gap-4 py-4 w-full justify-center border-y border-zinc-100 dark:border-zinc-800 my-4">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{userSwaps.length}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Posts</p>
                                    </div>
                                    <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800" />
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">5.0</p>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Rating</p>
                                    </div>
                                </div>

                                <div className="w-full text-left">
                                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-2">About</h4>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                        {profile.bio || "This user hasn't added a bio yet. They're likely too busy swapping skills!"}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Portfolio Links */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-zinc-50 dark:bg-zinc-900/40 rounded-[2rem] p-6 border border-zinc-100 dark:border-zinc-800"
                        >
                            <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4 flex items-center gap-2">
                                <ExternalLink size={12} /> External Links
                            </h4>
                            <div className="space-y-3">
                                {profile.portfolio_links?.length > 0 ? (
                                    profile.portfolio_links.map((link, i) => (
                                        <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="block text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate">
                                            {link}
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-sm text-zinc-500 italic">No links added</p>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Skills & Postings */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Skills Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-50/50 dark:bg-indigo-500/5 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-500/20"
                            >
                                <h4 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold mb-4">
                                    <Award size={18} /> Skills Offered
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills_offered?.length > 0 ? profile.skills_offered.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 shadow-sm">
                                            {skill}
                                        </span>
                                    )) : <span className="text-zinc-400 text-sm">N/A</span>}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-purple-50/50 dark:bg-purple-500/5 rounded-3xl p-6 border border-purple-100 dark:border-purple-500/20"
                            >
                                <h4 className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold mb-4">
                                    <ArrowRightLeft size={18} /> Wants to Learn
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {profile.skills_needed?.length > 0 ? profile.skills_needed.map((skill, i) => (
                                        <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shadow-sm">
                                            {skill}
                                        </span>
                                    )) : <span className="text-zinc-400 text-sm">N/A</span>}
                                </div>
                            </motion.div>
                        </div>

                        {/* Active Postings */}
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 flex items-center gap-2">
                                Active Swap Gigs <span className="text-indigo-500">{userSwaps.length}</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userSwaps.map((swap) => (
                                    <motion.div 
                                        key={swap._id}
                                        whileHover={{ y: -3 }}
                                        className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-md flex flex-col justify-between"
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-1">Exchange</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{swap.offerSkill}</span>
                                                    <ArrowRightLeft size={14} className="text-zinc-400" />
                                                    <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{swap.seekSkill}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500">
                                                <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(swap.createdAt).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">{swap.status}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {userSwaps.length === 0 && (
                                    <div className="col-span-2 py-12 text-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
                                        No active swap postings found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default PublicProfile;
