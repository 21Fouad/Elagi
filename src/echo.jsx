import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Setting up Pusher
window.Pusher = Pusher;

// Configure Echo instance
const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_KEY,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    encrypted: true,
    forceTLS: true
});

export default echo;
