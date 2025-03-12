export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface DashboardStats {
  totalEmployees: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  activeUsers: number;
  inactiveUsers: number;
} 