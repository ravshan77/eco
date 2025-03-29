import { apiRequest } from "./api";
import { ResponseType, TTask } from "@/types/types";


export type GetTasks = { filters: { search?: string | null, assigment_category_id?: number }, page_number: number }

export type ResponseUploadFileType<T> = Omit<ResponseType<T>, "resoult"> & {
  resoult: {
    base_url: T,
    file_path: T
  }; 
};


export const tasksApi = {
  getById: (id: string) => apiRequest<{resoult: TTask, status: boolean, error: { message: any }}>('GET', `/assigment/${id}`),
  create: (data: TTask) => apiRequest<{resoult: TTask, status: boolean, error: { message: any }}>('POST', '/assigment', data),
  getAll: (params: GetTasks) => apiRequest<ResponseType<TTask>>('POST', `/assigments?page=${params.page_number}`, params.filters ),
  delete: (id: number) => apiRequest<{resoult: string, status: boolean, error: { message: any }}>('DELETE', `/assigment-delete/${id}`),
  update: (data: TTask) => apiRequest<{resoult: TTask, status: boolean, error: { message: any }}>('PUT', `/assigment/${data.id}`, data),
  deleteImage:(file_path: string) => apiRequest<{resoult: string, status: boolean, error: { message: any }}>('DELETE', '/assigment-image-delete', {file_path}),
  uploadImage: (formData: FormData) => apiRequest<ResponseUploadFileType<string>>("POST", `/assigment-image-store`, formData, {"Content-Type": "multipart/form-data"}),
};
  