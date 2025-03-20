import { SingleOption } from "@/types/types";
import { apiRequest } from "./api";

export const regionsAPI = {
    getRegionsByStateId: (state_id: string) => apiRequest<{resoult: SingleOption[], status: boolean, error: { message: any }}>('GET', `/regions-by-state/${state_id}`)
    // getAll: () => apiRequest<{ resoult: SingleOption[], status: boolean, error: { message: any }}>('GET', '/states'),
    // create: (data: SingleOption) =>  apiRequest<{ resoult: SingleOption, status: boolean, error: { message: any }}>('POST', '/position', data),
    // getById: (id: string) => apiRequest<SingleOption>('GET', `/worker/${id}`),
    // update: (data: SingleOption) =>  apiRequest<{ resoult: SingleOption, status: boolean, error: { message: any }}>('PUT', `/position/${data.id}`, data),
    // delete: (id: number) => apiRequest<{ resoult: SingleOption, status: boolean, error: { message: any }}>('DELETE', `/position-delete/${id}`),
  };
  