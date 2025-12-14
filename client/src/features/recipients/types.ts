export interface RecipientState {
  items: Recipient[];
  selectedRecipient: Recipient | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

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