const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const Chat = require('./models/Chat');
const socketAuth = require('./middleware/socketAuth');

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
    origin: [
        'https://skill-swap-mu-one.vercel.app', 
        'http://localhost:5173'                 
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// 1. Middleware Set 1: CORS MUST be before Helmet
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// 2. Security Hardening
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // Secure HTTP headers
app.disable('x-powered-by'); // Mask tech stack

// 2. Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api', limiter);

// Remaining Middleware
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// Express 5.x workaround for express-mongo-sanitize (makes readonly properties writable)
app.use((req, res, next) => {
  ['body', 'params', 'query'].forEach(key => {
    if (req[key]) {
      Object.defineProperty(req, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: req[key]
      });
    }
  });
  next();
});

app.use(mongoSanitize()); // Prevent NoSQL Injection after parsing

// Socket.io Setup
const io = new Server(server, {
    cors: corsOptions
});

// Apply Socket.io Authentication Middleware
io.use(socketAuth);

io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id, 'User ID:', socket.userId);

    // Auto-join personal notification room
    socket.join(`user_${socket.userId}`);
    console.log(`🔔 User ${socket.userId} auto-joined notification room`);

    // Join a specific chat room
    socket.on('join_room', async (chatId) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) return;
            
            // Verify the authenticated user is a participant
            const isParticipant = chat.participants.some(
                p => p.toString() === socket.userId
            );
            
            if (!isParticipant) {
                socket.emit('error', { message: 'Not a participant of this chat' });
                return;
            }
            
            socket.join(chatId);
            console.log(`👤 User ${socket.userId} joined chat room: ${chatId}`);
        } catch (err) {
            console.error('join_room error:', err);
        }
    });

    // Send and save message
    socket.on('send_message', async (data) => {
        const { chatId, text } = data;
        const senderId = socket.userId; // USE THE VERIFIED IDENTITY
        
        if (!text || !text.trim()) return; // Prevent empty messages
        
        try {
            const chat = await Chat.findById(chatId);
            if (chat) {
                // Verify sender is a participant
                const isParticipant = chat.participants.some(
                    p => p.toString() === senderId
                );
                if (!isParticipant) return;

                const newMessage = {
                    sender: senderId,
                    text: text.trim(),
                    status: 'sent',
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

    // Mark messages as seen when a user opens the chat
    socket.on('mark_seen', async (chatId) => {
        try {
            const chat = await Chat.findById(chatId);
            if (!chat) return;

            const isParticipant = chat.participants.some(p => p.toString() === socket.userId);
            if (!isParticipant) return;

            let updated = false;
            chat.messages.forEach(msg => {
                if (msg.sender.toString() !== socket.userId && msg.status !== 'seen') {
                    msg.status = 'seen';
                    updated = true;
                }
            });

            if (updated) {
                await chat.save();
                // Emit event back to the room so sender UI updates
                io.to(chatId).emit('messages_read', { byUserId: socket.userId, chatId });
            }
        } catch (error) {
            console.error('Error marking seen:', error);
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
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(statusCode).json({
        message: isProduction ? 'Internal Server Error' : err.message,
        stack: isProduction ? undefined : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});