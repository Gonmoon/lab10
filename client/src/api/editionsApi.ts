import apiClient from './apiClient';

export interface Edition {
  _id: string;
  index: string;
  type: 'газета' | 'журнал';
  title: string;
  monthlyPrice: number;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditionFormData {
  index: string;
  type: 'газета' | 'журнал';
  title: string;
  monthlyPrice: number;
  photoUrl: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export const editionsApi = {
  getEditions: (params?: Record<string, any>) =>
    apiClient.get<PaginatedResponse<Edition>>('/editions', { params }),

  getEdition: (id: string) =>
    apiClient.get<Edition>(`/editions/${id}`),

  createEdition: (data: EditionFormData) =>
    apiClient.post<Edition>('/editions', data),

  updateEdition: (id: string, data: Partial<EditionFormData>) =>
    apiClient.put<Edition>(`/editions/${id}`, data),
};
