export type WorkerStatus = "1" | "2" | "3" | "4" | null

export enum WorkerStatusEnum {
  ish_faoliyatida = "1",
  tatil = "2",
  komandirovfka = "3",
  ishdan_boshatilingan = "4",
}

export interface TWorkers {
  id?: number | string | null;
  name: string;
  section_id?: string | null;
  section_name?: string | null;
  position_id: string;
  position_name?: string;
  passport_series: string;
  birthday: string;
  phone_youre: string;
  phone_additional?: string | null;
  phone_work?: string | null;
  address?: string | null;
  education?: string | null;
  education_place?: string | null;
  photo?: string | null;
  passport_number?: string | null;
  state_id?: string | null;
  state_name?: string | null;
  region_id?: string | null;
  region_name?: string | null;
  responsible_worker?: string | null;
  status: WorkerStatus;
  date?: string
}

export interface TSections {
    id?: number;
    name: string,
    responsible_worker?: string,
    created_at?: string
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

export interface SingleOption {
  id: string;
  name: string;
  label?: string;
}