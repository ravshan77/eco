export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
  department: string;
  status: 'active' | 'inactive';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  createdAt: string;
  deadline: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
} 