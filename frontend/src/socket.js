import { io } from 'socket.io-client';

const URL = "https://skill-swap-xkoj.onrender.com";

export const socket = io(URL, {
    autoConnect: false, // Connect manually when needed
    withCredentials: true
});
