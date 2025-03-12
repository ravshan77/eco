import axios from 'axios';
import { toast } from '../components/ui/use-toast';
const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    toast({
        variant: "destructive",
        title: "So'rov yuborishda xatolik",
        description: error.message || "Noma'lum xatolik yuz berdi",
    });
    return Promise.reject(error);
});
// Response interceptor
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast({
            variant: "destructive",
            title: "Avtorizatsiya xatosi",
            description: "Iltimos, qaytadan tizimga kiring",
        });
    }
    else {
        toast({
            variant: "destructive",
            title: "Xatolik yuz berdi",
            description: error.response?.data?.message || error.message || "Noma'lum xatolik yuz berdi",
        });
    }
    return Promise.reject(error);
});
// Universal API functions
const apiRequest = async (method, url, data) => {
    try {
        const response = await api.request({
            method,
            url,
            data,
        });
        return response.data;
    }
    catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
// Auth
export const authAPI = {
    login: (email, password) => apiRequest('POST', '/auth/login', { email, password }),
    logout: () => apiRequest('POST', '/auth/logout'),
};
// Tasks
export const tasksAPI = {
    getAll: () => apiRequest('GET', '/tasks'),
    getById: (id) => apiRequest('GET', `/tasks/${id}`),
    create: (task) => apiRequest('POST', '/tasks', task),
    update: (id, task) => apiRequest('PATCH', `/tasks/${id}`, task),
    delete: (id) => apiRequest('DELETE', `/tasks/${id}`),
    updateStatus: (id, status) => apiRequest('PATCH', `/tasks/${id}/status`, { status }),
};
// Employees
export const employeesAPI = {
    getAll: () => apiRequest('GET', '/employees'),
    getById: (id) => apiRequest('GET', `/employees/${id}`),
    create: (employee) => apiRequest('POST', '/employees', { ...employee, createdAt: new Date().toISOString() }),
    update: (id, employee) => apiRequest('PATCH', `/employees/${id}`, employee),
    delete: (id) => apiRequest('DELETE', `/employees/${id}`),
};
// Users
export const usersAPI = {
    getAll: () => apiRequest('GET', '/users'),
    getById: (id) => apiRequest('GET', `/users/${id}`),
    create: (user) => apiRequest('POST', '/users', user),
    update: (id, user) => apiRequest('PATCH', `/users/${id}`, user),
    delete: (id) => apiRequest('DELETE', `/users/${id}`),
    updateStatus: (id, status) => apiRequest('PATCH', `/users/${id}/status`, { status }),
};
// Dashboard
export const dashboardAPI = {
    getStats: () => apiRequest('GET', '/dashboard/stats'),
};
export default api;
