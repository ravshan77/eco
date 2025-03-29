export type WorkerOrdersStatus = 1 | 2 | 3 | 4 | 0;

export enum WorkerOrdersStatusEnum {
  buyruq_chiqarilmagan = 0,
  ish_faoliyatida = 1,
  tatil = 2,
  komandirovfka = 3,
  ishdan_boshatilingan = 4,
}

export enum TaskConfirmStatusEnum {
  Jarayonda = 0,
  Bajarilgan = 1,
  Tasdiqlangan = 2,
}

export enum TaskPreoriyStatusEnum {
  Qilinishi_kerak = 1,
  Muhim = 2,
  Zarur = 3,
}
export type StatusInfo = { color: string, text: string}

export type TWorkers = {
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
  region_id: number | null;
  region_name: string | null;
  responsible_worker?: string | null;
  section_name: string | null;
  state_id: number | null;
  state_name: string | null;
}

export type TSections = {
  id?: number;
  name: string;
  responsible_worker?: string;
  created_at?: string;
}

export type TPositions = {
  id?: number;
  name: string;
  section_id: number;
  section_name?: string | null;
  responsible_worker?: string;
  created_at?: string;
}

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  createdAt: string;
  deadline: string;
}

export type User = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "employee";
  status: "active" | "inactive";
  lastLogin: string;
  createdAt: string;
}

export type SingleOption = {
  id: string;
  name: string;
}

type PaginationLinks = {
  url: string | null;
  label: string | null;
  active: boolean;
};

export type PaginationMeta = {
  current_page: number;
  from: number;
  last_page: number;
  links: PaginationLinks[];
  path: string | null;
  per_page: number;
  to: number;
  total: number;
};
export type ResponseType<T> = {
  resoult: {
    data: T[];
    links: {
      first: string | null;
      last: string | null;
      prev: string | null;
      next: string | null;
    };
    meta: PaginationMeta;
  };
  status: boolean;
  error: { message: any };
};

export type TWorkersOrders = {
  id?: number;
  worker_id: number;
  worker_name?: string;
  order_number?: string;
  order_status: number;
  order_date: string;
  description?: string | null;
  resposible_worker?: string;
  created_at?: string;
};

export type TTaskCategory = {
  id?: number;
  name: string;
  description?: string | null;
  responsible_worker?: string;
  created_at?: string;
};

export type TTask = {
  id?: number;
  assigment_category_id: number;
  assigment_category_name?: string;
  assigment: string;
  file?: Array<string> | null;
  period_to: string;
  period_from: string;
  preority: number;
  worker_id: number;
  worker_name?: string;
  ball: string;
  confirmation_status?: number;
  responsible_worker?: string;
  created_at?: string;
  assignment_result?: TCompleteTask | null;
  assigment_confirmation?: TConfirmTask | null // check backend api in type
};

export type TCompleteTask = {
  id?: number;
  assigment_id: number;
  description: string;
  file?: Array<string> | null;
  worker_id?: number;
  worker_name?: string;
  created_at?: string;
};

export type TConfirmTask = {
  id?: number,
  assigment_id: number,
  description: string,
  fine: number | string,
  confirmation_worker_id?: number,
  confirmation_worker_name?: string,
  created_at?: string
}
