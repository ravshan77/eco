import { apiRequest } from "./api";
import { TConfirmTask } from "@/types/types";

// export type GeTConfirmTasks = { filters: { search?: string | null, assigment_category_id?: number }, page_number: number }

type ResponseType = {resoult: TConfirmTask, status: boolean, error: { message: any }} 

export const confirmTaskApi = {
  create: (data: TConfirmTask) => apiRequest<ResponseType>('POST', '/assigment-confirmation', data),
  getById: (id: string) => apiRequest<ResponseType>('GET', `/assigment-confirmation/${id}`),
  update: (data: TConfirmTask) => apiRequest<ResponseType>('PUT', `/assigment-confirmation/${data?.id}`, data),
  delete: (id: number) => apiRequest<{resoult: string, status: boolean, error: { message: any }}>('DELETE', `/assigment-confirmation-delete/${id}`),
};
  