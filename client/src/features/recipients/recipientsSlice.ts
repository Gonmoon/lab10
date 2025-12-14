import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { recipientsApi, Recipient, RecipientFormData, PaginatedResponse } from '../../api/recipientsApi';
import { RecipientState } from './types';

const initialState: RecipientState = {
  items: [],
  selectedRecipient: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
};

export const fetchRecipients = createAsyncThunk(
  'recipients/fetchRecipients',
  async (params?: { page?: number; limit?: number; sort?: string; search?: string }) => {
    const response = await recipientsApi.getRecipients(params);
    return response.data; // <-- здесь data с сервера { data: [...], meta: {...} }
  }
);

export const fetchRecipient = createAsyncThunk(
  'recipients/fetchRecipient',
  async (id: string) => {
    const response = await recipientsApi.getRecipient(id);
    return response.data;
  }
);

export const createRecipient = createAsyncThunk(
  'recipients/createRecipient',
  async (data: RecipientFormData, { rejectWithValue }) => {
    try {
      const response = await recipientsApi.createRecipient(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateRecipient = createAsyncThunk(
  'recipients/updateRecipient',
  async ({ id, data }: { id: string; data: Partial<RecipientFormData> }, { rejectWithValue }) => {
    try {
      const response = await recipientsApi.updateRecipient(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteRecipient = createAsyncThunk(
  'recipients/deleteRecipient',
  async (id: string, { rejectWithValue }) => {
    try {
      await recipientsApi.deleteRecipient(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const recipientsSlice = createSlice({
  name: 'recipients',
  initialState,
  reducers: {
    clearSelectedRecipient: (state) => {
      state.selectedRecipient = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data; // массив получателей
        state.pagination = action.payload.meta; // мета для пагинации
      })
      .addCase(fetchRecipients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить получателей';
      })
      .addCase(fetchRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipient.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRecipient = action.payload;
      })
      .addCase(fetchRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить получателя';
      })
      .addCase(createRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipient.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.selectedRecipient = action.payload;
      })
      .addCase(createRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось создать получателя';
      })
      .addCase(updateRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRecipient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedRecipient = action.payload;
      })
      .addCase(updateRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось обновить получателя';
      })
      .addCase(deleteRecipient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipient.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteRecipient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось удалить получателя';
      });
  },
});

export const { clearSelectedRecipient, clearError, setPage } = recipientsSlice.actions;
export default recipientsSlice.reducer;
