export type WorkerStatus = 1 | 2 | 3 | 4

export enum WorkerStatusEnum {
  ish_faoliyatida = 1,
  tatil = 2,
  komandirovfka = 3,
  ishdan_boshatilingan = 4,
}

export interface TWorkers {
  id?: number;
  birthday: string;
  name: string;
  position_id: number;
  phone_youre: string;
  status?: number;
  section_id: number | null;
  created_at?: string | null;
  address: string | null;
  education: string | null;
  education_place: string | null;
  passport_number: string | null;
  passport_series: string | null;
  phone_additional: string | null;
  phone_work: string | null;
  photo: string | null;
  position_name: string | null;
  region_id: string | null;
  region_name: string | null;
  responsible_worker?: string | null;
  section_name: string | null;
  state_id: string | null;
  state_name: string | null;
}

export interface TSections {
    id?: number;
    name: string,
    responsible_worker?: string,
    created_at?: string
}

export interface TPositions {
  id?: number,
  name: string,
  section_id: number,
  section_name?: string,
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
}

type PaginationLinks = {
  url: string | null,
  label: string | null,
  active: boolean
}

export type PaginationMeta =  { 
  current_page: number, 
  from: number, 
  last_page: number, 
  links: PaginationLinks[],
  path: string | null,
  per_page: number,
  to: number,
  total: number  
}
export type ResponseType<T> = {
  resoult:{
    data: T[], 
    links: {
      first: string | null,
      last: string | null,
      prev: string | null,
      next: string | null,
    },
    meta: PaginationMeta,
  },
  status: boolean,
  error: { message: any }
}