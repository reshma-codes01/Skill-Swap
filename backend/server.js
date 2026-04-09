const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');


// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, 
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/', (req, res) => {
    res.send('Skill Swap API is running! 🚀');
});

// API Routes
// Using /api/auth as it fits authentication endpoints better
app.use('/api/auth', userRoutes);
app.use('/api/swaps', swapRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});