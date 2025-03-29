import { apiRequest } from "./api";
import { TCompleteTask } from "@/types/types";


// export type GeTCompleteTasks = { filters: { search?: string | null, assigment_category_id?: number }, page_number: number }

type ResponseType = {resoult: TCompleteTask, status: boolean, error: { message: any }} 

export const completeTaskApi = {
  create: (data: TCompleteTask) => apiRequest<ResponseType>('POST', '/assigment-result', data),
  getById: (id: string) => apiRequest<ResponseType>('GET', `/assigment-result/${id}`),
  update: (data: TCompleteTask) => apiRequest<ResponseType>('PUT', `/assigment-result/${data?.id}`, data),
  delete: (id: number) => apiRequest<{resoult: string, status: boolean, error: { message: any }}>('DELETE', `/assigment-result-delete/${id}`),
};
  