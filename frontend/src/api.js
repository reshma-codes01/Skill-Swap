import axios from 'axios';

// Development mein localhost chalega, aur Production mein live URL
const API = axios.create({
    baseURL: process.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true, // Cookies/Tokens pass karne ke liye zaroori hai
});

// Attach Authorization header if token exists in localStorage
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;