import axios from 'axios';
import { toast } from '../components/ui/use-toast';
import { User, Task, TWorkers } from '../types/types';

// https://garant-hr.uz/api/anketa-web-app/store/image
const api = axios.create({
  baseURL: 'https://ecouzkpi-main-9umb8r.laravel.cloud/api',
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
  },
  (error) => {
    toast({ variant: "destructive", title: "So'rov yuborishda xatolik", description: error.message || "Noma'lum xatolik yuz berdi" });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast({ variant: "destructive", title: "Avtorizatsiya xatosi", description: "Iltimos, qaytadan tizimga kiring" });
    } else {
      toast({ variant: "destructive", title: "Xatolik yuz berdi", description: error.response?.data?.message || error.message || "Noma'lum xatolik yuz berdi" });
    }
    return Promise.reject(error);
  }
);

// Universal API functions
export const apiRequest = async <T>(method: string, url: string, data?: any, headers = {}) => {
  // console.log(data instanceof FormData ? "forumdata" : "jsondata")
  try {
    const response = await api.request<T>({
      method,
      url,
      data,
      headers: {
        ...(data instanceof FormData ? {"Content-Type": "multipart/form-data"} : { "Content-Type": "application/json" }), // FormData bo‘lsa, Content-Type set qilinmaydi
        ...headers,
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth
export const authAPI = {
  login: (email: string, password: string) => apiRequest<{ user: User; token: string }>('POST', '/auth/login', { email, password }),
  logout: () => apiRequest('POST', '/auth/logout'),
};

// Tasks
export const tasksAPI = {
  getAll: () => apiRequest<Task[]>('GET', '/tasks'),
  getById: (id: string) => apiRequest<Task>('GET', `/tasks/${id}`),
  create: (task: Omit<Task, 'id'>) => apiRequest<Task>('POST', '/tasks', task),
  update: (id: string, task: Partial<Task>) => apiRequest<Task>('PATCH', `/tasks/${id}`, task),
  delete: (id: string) => apiRequest('DELETE', `/tasks/${id}`),
  updateStatus: (id: string, status: Task['status']) => apiRequest<Task>('PATCH', `/tasks/${id}/status`, { status }),
};

// Employees
export const employeesAPI = {
  getAll: () => apiRequest<TWorkers[]>('GET', '/employees'),
  getById: (id: string) => apiRequest<TWorkers>('GET', `/employees/${id}`),
  create: (employee: Omit<TWorkers, 'id' | 'createdAt'>) =>  apiRequest<TWorkers>('POST', '/employees', { ...employee, createdAt: new Date().toISOString() }),
  update: (id: string, employee: Partial<TWorkers>) => apiRequest<TWorkers>('PATCH', `/employees/${id}`, employee),
  delete: (id: string) => apiRequest('DELETE', `/employees/${id}`),
};

// Users
export const usersAPI = {
  getAll: () => apiRequest<User[]>('GET', '/users'),
  getById: (id: string) => apiRequest<User>('GET', `/users/${id}`),
  create: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => apiRequest<User>('POST', '/users', user),
  update: (id: string, user: Partial<User>) => apiRequest<User>('PATCH', `/users/${id}`, user),
  delete: (id: string) => apiRequest('DELETE', `/users/${id}`),
  updateStatus: (id: string, status: User['status']) => apiRequest<User>('PATCH', `/users/${id}/status`, { status }),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => apiRequest('GET', '/dashboard/stats'),
};

export default api; 