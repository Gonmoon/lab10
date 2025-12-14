import apiClient from './apiClient';

export interface Recipient {
  _id: string;
  code: string;
  fullName: string;
  street: string;
  house: string;
  apartment: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientFormData {
  code: string;
  fullName: string;
  street: string;
  house: string;
  apartment: string;
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

export const recipientsApi = {
  getRecipients: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }) => apiClient.get<PaginatedResponse<Recipient>>('/recipients', { params }),

  getRecipient: (id: string) => apiClient.get<Recipient>(`/recipients/${id}`),

  createRecipient: (data: RecipientFormData) =>
    apiClient.post<Recipient>('/recipients', data),

  updateRecipient: (id: string, data: Partial<RecipientFormData>) =>
    apiClient.put<Recipient>(`/recipients/${id}`, data),

  deleteRecipient: (id: string) => apiClient.delete(`/recipients/${id}`),

  checkExists: (id: string) =>
    apiClient.get<{ exists: boolean }>(`/recipients/${id}/exists`),
};
