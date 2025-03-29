import { TSections } from "@/types/types";
import { apiRequest } from "./api";

export const sectionsAPI = {
    getAll: () => apiRequest<{ resoult: TSections[], status: boolean, error: { message: any }}>('POST', '/sections'),
    create: (data: TSections) =>  apiRequest<{ resoult: TSections, status: boolean, error: { message: any }}>('POST', '/section', data),
    // getById: (id: string) => apiRequest<TSections>('GET', `/worker/${id}`),
    update: (data: TSections) =>  apiRequest<{ resoult: TSections, status: boolean, error: { message: any }}>('PUT', `/section/${data.id}`, data),
    delete: (id: number) => apiRequest<{ resoult: TSections, status: boolean, error: { message: any }}>('DELETE', `/section-delete/${id}`),
  };
  