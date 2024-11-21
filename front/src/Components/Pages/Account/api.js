import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5100/api', // Adjust base URL as needed
});

export default API;
