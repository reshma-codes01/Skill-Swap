import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Check, X, Clock, ArrowRightLeft, User, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import API from '../api';
import PageWrapper from '../components/PageWrapper';

const tabs = ['Received Requests', 'Sent Proposals'];

const Requests = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [receivedRes, sentRes] = await Promise.all([
                API.get('/requests/received'),
                API.get('/requests/sent')
            ]);
            setReceived(receivedRes.data);
            setSent(sentRes.data);
        } catch (error) {
            toast.error('Failed to fetch requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/requests/${id}/status`, { status });
            toast.success(`Request ${status.toLowerCase()}!`);
            fetchData(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const renderRequestCard = (request, isReceived) => {
        const otherUser = isReceived ? request.applicantId : request.swapId?.postedBy;
        const statusColor = {
            'Pending': 'text-amber-500 bg-amber-500/10',
            'Accepted': 'text-green-500 bg-green-500/10',
            'Rejected': 'text-red-500 bg-red-500/10'
        }[request.status];

        return (
            <motion.div
                key={request._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 p-6 shadow-xl shadow-indigo-500/5 mb-4 group"
            >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                {otherUser?.name?.charAt(0)}
                            </div>
                            <div>
                                <Link to={`/profile/${otherUser?._id}`} className="font-bold text-zinc-900 dark:text-zinc-50 hover:text-indigo-600 transition-colors">
                                    {otherUser?.name}
                                </Link>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                    <MapPin size={10} /> Campus Member
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Swap Title</p>
                                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{request.swapId?.title || 'Untitled Swap'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Offered</p>
                                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{isReceived ? request.offeredSkill : request.swapId?.offerSkill}</p>
                                </div>
                                <ArrowRightLeft className="text-zinc-300" size={16} />
                                <div className="flex-1">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">In Exchange For</p>
                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{isReceived ? request.swapId?.offerSkill : request.offeredSkill}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-1">Pitch</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">"{request.message}"</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between items-end min-w-[120px]">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                            {request.status}
                        </span>

                        <div className="flex flex-col gap-2 w-full mt-4">
                            {isReceived && request.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => handleStatusUpdate(request._id, 'Accepted')}
                                        className="w-full py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Check size={14} /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                                        className="w-full py-2.5 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-xl text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X size={14} /> Reject
                                    </button>
                                </>
                            )}
                            
                            {request.status === 'Accepted' && (
                                <Link
                                    to={`/chat/${request.swapId?._id}/${otherUser?._id}`}
                                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    <MessageSquare size={14} /> Chat Now
                                </Link>
                            )}

                            {request.status === 'Pending' && !isReceived && (
                                <p className="text-[10px] text-zinc-400 text-center italic mt-auto">Waiting for response...</p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <PageWrapper>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12">
                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Swap Station</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your skill exchange proposals and active matches.</p>
                </header>

                {/* Tabs */}
                <div className="flex space-x-8 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative pb-4 text-base font-bold transition-colors whitespace-nowrap outline-none px-2 ${
                                activeTab === tab ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                        >
                            {tab}
                            <span className="ml-2 text-xs opacity-50">
                                ({tab === 'Received Requests' ? received.length : sent.length})
                            </span>
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTabIndicatorRequests"
                                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-indigo-600 dark:bg-indigo-400 rounded-t-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-full h-48 bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] animate-pulse" />)}
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'Received Requests' ? (
                                <div key="received">
                                    {received.length > 0 ? (
                                        received.map(req => renderRequestCard(req, true))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                            <ArrowRightLeft size={48} className="mb-4 opacity-50" />
                                            <p className="font-bold">No incoming requests yet.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div key="sent">
                                    {sent.length > 0 ? (
                                        sent.map(req => renderRequestCard(req, false))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                                            <Clock size={48} className="mb-4 opacity-50" />
                                            <p className="font-bold">You haven't sent any proposals.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Requests;
