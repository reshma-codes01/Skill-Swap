const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // 🛠️ Fix 1: CORS package import kiya
const userRoutes = require('./routes/userRoutes');

// 🛠️ Fix 2: dotenv.config() ko sabse upar rakha taaki .env variables turant load ho jayein
dotenv.config();

// 🛠️ Fix 3: Pehle 'app' banayenge, uske baad uspe rules lagayenge
const app = express();

// Development aur Production dono ke liye CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, 
};

// Middleware
app.use(cors(corsOptions)); // 🛠️ Fix 4: Sahi sequence mein CORS apply kiya
app.use(express.json()); // JSON data parse karne ke liye

// Health Check Route
app.get('/', (req, res) => {
    res.send('Skill Swap API is running! 🚀');
});

// API Routes
app.use('/api/users', userRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; 

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('🔥 MongoDB Connected successfully!');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });