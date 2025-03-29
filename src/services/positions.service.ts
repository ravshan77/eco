import { TPositions } from "@/types/types";
import { apiRequest } from "./api";

export const positionsAPI = {
    getAll: () => apiRequest<{ resoult: TPositions[], status: boolean, error: { message: any }}>('POST', '/positions'),
    getPositionBySectionId: (section_id: number) => apiRequest<{ resoult: TPositions[], status: boolean, error: { message: any }}>('GET', `/position-by_section/${section_id}`),
    create: (data: TPositions) =>  apiRequest<{ resoult: TPositions, status: boolean, error: { message: any }}>('POST', '/position', data),
    // getById: (id: string) => apiRequest<TPositions>('GET', `/worker/${id}`),
    update: (data: TPositions) =>  apiRequest<{ resoult: TPositions, status: boolean, error: { message: any }}>('PUT', `/position/${data.id}`, data),
    delete: (id: number) => apiRequest<{ resoult: TPositions, status: boolean, error: { message: any }}>('DELETE', `/position-delete/${id}`),
  };
  