// imports
import { io } from 'socket.io-client';
import { MODE } from './constants';

// vars
const VITE_APP_API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const URL = 'http://localhost:5000';

// instance
const socket = io(URL, {
    // autoConnect: false,
});

export default socket;