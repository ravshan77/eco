import { TTaskCategory } from "@/types/types";
import { apiRequest } from "./api";

export const taskCategoryApi = {
    getAll: () => apiRequest<{ resoult: TTaskCategory[], status: boolean, error: { message: any }}>('POST', '/assigment-categories'),
    create: (data: TTaskCategory) =>  apiRequest<{ resoult: TTaskCategory, status: boolean, error: { message: any }}>('POST', '/assigment-category', data),
    getById: (id: string) => apiRequest<TTaskCategory>('GET', `/assigment-category/${id}`),
    update: (data: TTaskCategory) =>  apiRequest<{ resoult: TTaskCategory, status: boolean, error: { message: any }}>('PUT', `/assigment-category/${data.id}`, data),
    delete: (id: number) => apiRequest<{ resoult: TTaskCategory, status: boolean, error: { message: any }}>('DELETE', `/assigment-category-delete/${id}`),
  };
  