import { Edition } from '../../api/editionsApi';
import { Recipient } from '../../api/recipientsApi';

export interface SubscriptionState {
  items: Subscription[];
  selectedSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

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