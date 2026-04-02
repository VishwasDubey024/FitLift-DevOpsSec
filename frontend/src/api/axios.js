import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.85.134.133:8000/api', 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;