const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Chat = require('./models/Chat');

// Routes Import
const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');
const requestRoutes = require('./routes/requestRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const Notification = require('./models/Notification');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, 
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// Socket.io Setup
const io = new Server(server, {
    cors: corsOptions
});

io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id);

    // Join a specific chat room
    socket.on('join_room', (chatId) => {
        socket.join(chatId);
        console.log(`👤 User joined chat room: ${chatId}`);
    });

    // Join a private user room for notifications
    socket.on('identify_user', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`🔔 User ${userId} identified for notifications`);
    });

    // Send and save message
    socket.on('send_message', async (data) => {
        const { chatId, senderId, text } = data;
        
        try {
            const chat = await Chat.findById(chatId);
            if (chat) {
                const newMessage = {
                    sender: senderId,
                    text,
                    timestamp: new Date()
                };
                chat.messages.push(newMessage);
                await chat.save();

                // 2. First Message Notification Logic
                if (chat.messages.length === 1) {
                    const recipientId = chat.participants.find(p => String(p) !== String(senderId));
                    if (recipientId) {
                        try {
                            const notification = await Notification.create({
                                recipient: recipientId,
                                sender: senderId,
                                type: 'new_chat',
                                swapId: chat.swapId,
                                message: 'started a new conversation with you'
                            });

                            const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name');
                            io.to(`user_${recipientId}`).emit('new_notification', populatedNotification);
                        } catch (notifyErr) {
                            console.error('Error creating chat notification:', notifyErr);
                        }
                    }
                }

                // Emit to everyone in the room
                io.to(chatId).emit('receive_message', newMessage);
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// Health Check Route
app.get('/', (req, res) => {
    res.send('Skill Swap API is running! 🚀');
});

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Make io accessible to our routes/controllers
app.set('socketio', io);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});