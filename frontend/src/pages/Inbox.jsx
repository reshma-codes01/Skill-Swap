import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Calendar, ChevronRight, Search, Inbox as InboxIcon } from 'lucide-react';
import { toast } from 'sonner';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/PageWrapper';

const Inbox = () => {
    const { user } = useAuth();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await API.get('/chats');
                setChats(response.data);
            } catch (error) {
                toast.error('Failed to load conversations');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, []);

    const filteredChats = chats.filter(chat => {
        const otherUser = chat.participants.find(p => p._id !== user._id);
        return (
            otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.swapId?.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 py-12 mt-16">
                <header className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-3">
                                Messages <MessageSquare className="text-indigo-500 w-8 h-8" />
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                                Manage your collaborations and skill swap discussions.
                            </p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </header>

                {filteredChats.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        {filteredChats.map((chat) => {
                            const otherUser = chat.participants.find(p => p._id !== user._id);
                            const lastMessage = chat.messages[chat.messages.length - 1];
                            
                            return (
                                <motion.div key={chat._id} variants={itemVariants}>
                                    <Link
                                        to={`/chat/${chat.swapId?._id}/${otherUser?._id}`}
                                        className="group block bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Avatar/Initial */}
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                                    {otherUser?.name.charAt(0)}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {otherUser?.name}
                                                    </h3>
                                                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(chat.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold rounded-md text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border border-zinc-200 dark:border-zinc-700">
                                                        {chat.swapId?.title || 'Unknown Swap'}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate pr-4 italic">
                                                    {lastMessage ? (
                                                        <>
                                                            <span className="font-bold text-zinc-400 not-italic mr-1">
                                                                {lastMessage.sender === user._id ? 'You:' : `${otherUser?.name}:`}
                                                            </span>
                                                            {lastMessage.text}
                                                        </>
                                                    ) : (
                                                        'No messages yet. Start the conversation!'
                                                    )}
                                                </p>
                                            </div>

                                            <div className="hidden sm:flex text-zinc-300 group-hover:text-indigo-500 transition-colors">
                                                <ChevronRight size={24} />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-24 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="p-6 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-zinc-500/5 mb-6">
                            <InboxIcon className="w-12 h-12 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">No messages yet</h3>
                        <p className="text-zinc-500 text-center max-w-xs mt-2 px-4">
                            When your swap requests are accepted, conversations will appear here.
                        </p>
                        <Link
                            to="/explore"
                            className="mt-8 px-8 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
                        >
                            Explore Swaps
                        </Link>
                    </motion.div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Inbox;
