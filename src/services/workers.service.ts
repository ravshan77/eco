import { TWorkers } from "@/types/types";
import { apiRequest } from "./api";

// Employees
export const workersAPI = {
    getAll: () => apiRequest<TWorkers[]>('GET', '/workers'),
    getById: (id: string) => apiRequest<TWorkers>('GET', `/worker/${id}`),
    create: (employee: Omit<TWorkers, 'id' | 'createdAt'>) =>  apiRequest<TWorkers>('POST', '/worker', { ...employee, createdAt: new Date().toISOString() }),
    update: (id: string, employee: Partial<TWorkers>) => apiRequest<TWorkers>('PATCH', `/worker/${id}`, employee),
    delete: (id: string) => apiRequest('DELETE', `/worker/${id}`),
  };
  