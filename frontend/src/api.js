import axios from 'axios';

// Development mein localhost chalega, aur Production mein live URL
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true, // Cookies/Tokens pass karne ke liye zaroori hai
});

export default API;