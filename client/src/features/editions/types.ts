export type EditionType = 'газета' | 'журнал';

export interface EditionState {
  items: Edition[];
  selectedEdition: Edition | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export interface Edition {
  _id: string;
  index: string;
  type: EditionType;
  title: string;
  monthlyPrice: number;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}