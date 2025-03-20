// import { ResponseType } from "./../types/types";
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
    getAll: (params: GetWorkers) => apiRequest<ResponseType<TWorkers>>('GET', `/workers?page=${params.page_number}`, params.filters ),
    uploadImage: (formData: FormData) => apiRequest<ResponseUploadFileType<string>>("POST", `/worker-image-store`, formData, {"Content-Type": "multipart/form-data"}),
    //! deleteImage: (file: File) => apiRequest<ResponseUploadFileType /> // deletni kiyinroq qilamiz dedi johon aka
    create: (data: TWorkers) => apiRequest<{resoult: TWorkers, status: boolean, error: { message: any }}>('POST', '/worker', data),
    getById: (id: string) => apiRequest<TWorkers>('GET', `/worker/${id}`),
    update: (id: string, employee: Partial<TWorkers>) => apiRequest<TWorkers>('PATCH', `/worker/${id}`, employee),
    delete: (id: string) => apiRequest('DELETE', `/worker/${id}`),
  };
  