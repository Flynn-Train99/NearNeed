// Set your local development IP here - replace with your actual IP address
const DEV_IP = '172.25.0.1'; // Change this to your computer's IP address

export const API_URL = __DEV__ 
  ? `http://${DEV_IP}:5000/api` 
  : 'https://api.nearneed.com/api';

export const SOCKET_URL = __DEV__ 
  ? `http://${DEV_IP}:5000` 
  : 'https://api.nearneed.com';