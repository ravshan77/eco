import { apiRequest } from "./api";
import { ResponseType, TWorkers } from "@/types/types";


export type GetWorkers = { filters: { search: string | null }, page_number: number }

export type ResponseUploadFileType<T> = Omit<ResponseType<T>, "resoult"> & {
  resoult: {
    base_url: T,
    file_path: T
  }; 
};


export const workersAPI = {
    getAll: (params: GetWorkers) => apiRequest<ResponseType<TWorkers>>('POST', `/workers?page=${params.page_number}`, params.filters ),
    uploadImage: (formData: FormData) => apiRequest<ResponseUploadFileType<string>>("POST", `/worker-image-store`, formData, {"Content-Type": "multipart/form-data"}),
    deleteImage:(file_path: string) => apiRequest<{resoult: string, status: boolean, error: { message: any }}>('DELETE', '/worker-image-delete', {file_path}),
    create: (data: TWorkers) => apiRequest<{resoult: TWorkers, status: boolean, error: { message: any }}>('POST', '/worker', data),
    update: (data: TWorkers) => apiRequest<{resoult: TWorkers, status: boolean, error: { message: any }}>('PUT', `/worker/${data.id}`, data),
    getById: (id: number) => apiRequest<{resoult: TWorkers, status: boolean, error: { message: any }}>('GET', `/worker/${id}`),
    delete: (id: number) => apiRequest<{resoult: TWorkers, status: boolean, error: { message: any }}>('DELETE', `/worker-delete/${id}`),
    getAllForAssigment: (params: GetWorkers) => apiRequest<ResponseType<TWorkers>>('POST', `/worker-list-for-assigment?page=${params.page_number}`, params.filters ),
  };
  