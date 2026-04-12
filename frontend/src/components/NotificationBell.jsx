import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, MessageSquare, Handshake, Users, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { user, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user) return;

        // 1. Fetch existing notifications
        const fetchNotifications = async () => {
            try {
                const res = await API.get('/notifications');
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.isRead).length);
            } catch (err) {
                console.error('Failed to fetch notifications:', err);
            }
        };

        fetchNotifications();

        // 2. Socket Listeners
        socket.auth = { token: localStorage.getItem('token') };
        socket.connect();

        const handleNewNotification = (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            // Dynamic subtle audio ping could go here if requested
        };

        socket.on('new_notification', handleNewNotification);

        // 3. Click outside logic
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            socket.off('new_notification', handleNewNotification);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [user, isAuthenticated]);

    const markAsRead = async (id) => {
        try {
            await API.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification._id);
        setIsOpen(false);

        // Routing based on type
        if (notification.type === 'new_chat') {
            navigate(`/inbox`);
        } else if (notification.type.startsWith('request')) {
            navigate('/requests');
        } else if (notification.type === 'new_request') {
            navigate('/requests');
        }
    };

    const getTypeStyles = (type) => {
        switch (type) {
            case 'request_accepted': return { icon: <Handshake className="text-green-500" />, bg: 'bg-green-500/10' };
            case 'request_rejected': return { icon: <X className="text-red-500" />, bg: 'bg-red-500/10' };
            case 'new_chat': return { icon: <MessageSquare className="text-indigo-500" />, bg: 'bg-indigo-500/10' };
            case 'new_request': return { icon: <Users className="text-purple-500" />, bg: 'bg-purple-500/10' };
            default: return { icon: <Bell className="text-zinc-500" />, bg: 'bg-zinc-500/10' };
        }
    };

    if (!isAuthenticated) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors focus:outline-none"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900 shadow-md"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl border border-zinc-100 dark:border-zinc-800 z-[60] overflow-hidden"
                    >
                        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Activity Feed</h3>
                            {unreadCount > 0 && (
                                <span className="text-[10px] font-bold px-2 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg uppercase tracking-wider uppercase">
                                    {unreadCount} New
                                </span>
                            )}
                        </div>

                        <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                                    {notifications.map((n) => {
                                        const { icon, bg } = getTypeStyles(n.type);
                                        return (
                                            <div
                                                key={n._id}
                                                onClick={() => handleNotificationClick(n)}
                                                className={`p-4 flex gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors relative group ${!n.isRead ? 'bg-indigo-50/20 dark:bg-indigo-500/5' : ''}`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-inner`}>
                                                    {icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-snug">
                                                        <span className="font-bold">{n.sender?.name}</span> {n.message}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {!n.isRead && (
                                                            <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Bell className="text-zinc-300" size={32} />
                                    </div>
                                    <p className="text-sm text-zinc-500 font-medium">All caught up!</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 text-center bg-zinc-50/50 dark:bg-zinc-950/50">
                            <button 
                                onClick={() => navigate('/requests')}
                                className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 tracking-widest uppercase"
                            >
                                View All Requests
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
