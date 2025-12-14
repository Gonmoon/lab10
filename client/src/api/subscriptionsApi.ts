import apiClient from './apiClient';
import { Edition } from './editionsApi';
import { Recipient } from './recipientsApi';

export interface Subscription {
  _id: string;
  recipient: Recipient;
  edition: Edition;
  months: 1 | 3 | 6;
  startMonth: number;
  startYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionFormData {
  recipient: string;
  edition: string;
  months: 1 | 3 | 6;
  startMonth: number;
  startYear: number;
}

export const subscriptionsApi = {
  getSubscriptions: (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    months?: number;
    startYear?: number;
    startMonth?: number;
  }) => apiClient.get<PaginatedResponse<Subscription>>('/subscriptions', { params }),

  getSubscription: (id: string) => apiClient.get<Subscription>(`/subscriptions/${id}`),

  createSubscription: (data: SubscriptionFormData) =>
    apiClient.post<Subscription>('/subscriptions', data),

  updateSubscription: (id: string, data: Partial<SubscriptionFormData>) =>
    apiClient.put<Subscription>(`/subscriptions/${id}`, data),

  deleteSubscription: (id: string) => apiClient.delete(`/subscriptions/${id}`),

  checkExists: (id: string) => apiClient.get<{ exists: boolean }>(`/subscriptions/${id}/exists`),
};