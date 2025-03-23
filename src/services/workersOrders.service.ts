import { apiRequest } from "./api";
import { ResponseType, TWorkersOrders } from "@/types/types";

export type GetWorkersOrders = { filters: { search: string | null }, page_number: number }

export const workersOrdersAPI = {
  getAll: (params: GetWorkersOrders) => apiRequest<ResponseType<TWorkersOrders>>('GET', `/worker-orders?page=${params.page_number}`, params.filters ),
  create: (data: TWorkersOrders) => apiRequest<{resoult: TWorkersOrders, status: boolean, error: { message: any }}>('POST', '/worker-order', data),
  getById: (id: number) => apiRequest<{resoult: TWorkersOrders, status: boolean, error: { message: any }}>('GET', `/worker-order/${id}`),
  update: (data: TWorkersOrders) => apiRequest<{resoult: TWorkersOrders, status: boolean, error: { message: any }}>('PUT', `/worker-order/${data.id}`, data),
  delete: (id: number) => apiRequest<{resoult: TWorkersOrders, status: boolean, error: { message: any }}>('DELETE', `/worker-order-delete/${id}`),
};
  