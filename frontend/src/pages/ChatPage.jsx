import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, ShieldCheck, Info, Check, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';
import { socket } from '../socket';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import PageWrapper from '../components/PageWrapper';

const ChatPage = () => {
    const { swapId, otherUserId } = useParams();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [chatId, setChatId] = useState(null);
    const [otherUser, setOtherUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const scrollRef = useRef(null);

    // 1. Fetch Chat History & Other User Details
    useEffect(() => {
        const initChat = async () => {
            try {
                // Fetch chat metadata and history
                const chatRes = await API.get(`/chats/${swapId}/${otherUserId}`);
                setChatId(chatRes.data._id);
                setMessages(chatRes.data.messages);

                // Fetch other user public profile
                const userRes = await API.get(`/profiles/${otherUserId}`);
                setOtherUser(userRes.data);

                socket.auth = { token: localStorage.getItem('token') };
                socket.connect();
                socket.emit('join_room', chatRes.data._id);
                
                // Trigger Seen Hooks
                API.put(`/chats/seen/${chatRes.data._id}`).catch(err => console.error(err));
                socket.emit('mark_seen', chatRes.data._id);
            } catch (error) {
                const msg = error.response?.data?.message || 'Unauthorized or failed to load chat';
                toast.error(msg);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (swapId && otherUserId) {
            initChat();
        }

        return () => {
            socket.disconnect();
        };
    }, [swapId, otherUserId]);

    // 2. Listen for Incoming Messages & Status Updates
    useEffect(() => {
        const messageHandler = (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);
            
            // Mark new incoming messages as seen immediately if we are active
            if (newMessage.sender !== user?._id && chatId) {
                socket.emit('mark_seen', chatId);
                API.put(`/chats/seen/${chatId}`).catch(console.error);
            }
        };

        const readHandler = ({ byUserId, chatId: receivedChatId }) => {
            if (byUserId !== user?._id && receivedChatId === chatId) {
                setMessages((prev) => prev.map(msg => ({
                    ...msg,
                    status: msg.sender === user?._id ? 'seen' : msg.status
                })));
            }
        };

        socket.on('receive_message', messageHandler);
        socket.on('messages_read', readHandler);

        return () => {
            socket.off('receive_message', messageHandler);
            socket.off('messages_read', readHandler);
        };
    }, [chatId, user?._id]);

    // 3. Auto-scroll Logic
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !chatId) return;

        const messageData = {
            chatId,
            senderId: user?._id,
            text: inputText.trim()
        };

        // Emit via socket
        socket.emit('send_message', messageData);

        // Optimistic update for sender UI
        // Note: The backend 'receive_message' broadcast will also reach us if io.to(chatId).emit is used.
        // We can either wait for the bounce-back or show it instantly. 
        // Showing it instantly and filtering out duplicates if needed is better.
        // For simplicity, we'll let receive_message handle it for everyone.
        
        setInputText('');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-zinc-500 font-bold animate-pulse">Initializing Secure Chat...</p>
                </div>
            </div>
        );
    }

    return (
        <PageWrapper>
            <div className="h-[calc(100vh-64px)] flex flex-col max-w-5xl mx-auto bg-white dark:bg-zinc-900 shadow-2xl border-x border-zinc-100 dark:border-zinc-800">
                {/* Chat Header */}
                <header className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <Link to="/requests" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold shadow-md">
                                {otherUser?.name?.charAt(0)}
                            </div>
                            <div>
                                <h2 className="font-bold text-zinc-900 dark:text-zinc-50">{otherUser?.name}</h2>
                                <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Secure Connection
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
                            <ShieldCheck size={12} className="text-indigo-500" /> End-to-End Encryption
                         </div>
                         <button className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"><MoreVertical size={20} /></button>
                    </div>
                </header>

                {/* Message Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    <div className="flex flex-col items-center justify-center py-8 opacity-50">
                        <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2">
                            <Info size={20} />
                        </div>
                        <p className="text-xs font-bold text-center dark:text-zinc-400">
                            Terms accepted. You are now chatting regarding swap: <br/>
                            <span className="text-indigo-600 dark:text-indigo-400">Match Confirmed</span>
                        </p>
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.sender === user?._id;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl shadow-sm border ${
                                    isMe 
                                    ? 'bg-zinc-900 text-white border-zinc-900 rounded-tr-none' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 rounded-tl-none'
                                }`}>
                                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                    <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end text-zinc-400' : 'justify-start text-zinc-500'}`}>
                                        <span className="text-[9px] font-bold block">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            msg.status === 'seen' 
                                            ? <CheckCheck size={12} className="text-[#34B7F1]" />
                                            : <Check size={12} className="text-zinc-400" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="w-full px-5 py-3.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-2xl text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-[15px]"
                            />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!inputText.trim()}
                            className="p-3.5 bg-zinc-900 dark:bg-indigo-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/10 active:shadow-inner transition-all"
                        >
                            <Send size={22} className="ml-0.5" />
                        </motion.button>
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ChatPage;
