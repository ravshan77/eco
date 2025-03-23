import { TAssigmentCategory } from "@/types/types";
import { apiRequest } from "./api";

export const assigmenCategorytAPI = {
    getAll: () => apiRequest<{ resoult: TAssigmentCategory[], status: boolean, error: { message: any }}>('GET', '/assigment-categories'),
    create: (data: TAssigmentCategory) =>  apiRequest<{ resoult: TAssigmentCategory, status: boolean, error: { message: any }}>('POST', '/assigment-category', data),
    getById: (id: string) => apiRequest<TAssigmentCategory>('GET', `/assigment-category/${id}`),
    update: (data: TAssigmentCategory) =>  apiRequest<{ resoult: TAssigmentCategory, status: boolean, error: { message: any }}>('PUT', `/assigment-category/${data.id}`, data),
    delete: (id: number) => apiRequest<{ resoult: TAssigmentCategory, status: boolean, error: { message: any }}>('DELETE', `/assigment-category-delete/${id}`),
  };
  