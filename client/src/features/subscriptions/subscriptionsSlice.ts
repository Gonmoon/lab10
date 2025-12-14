import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { subscriptionsApi, Subscription, SubscriptionFormData, PaginatedResponse } from '../../api/subscriptionsApi';
import { SubscriptionState } from './types';

const initialState: SubscriptionState = {
  items: [],
  selectedSubscription: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10,
  },
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async (params?: { page?: number; limit?: number; sort?: string; search?: string; months?: number; startYear?: number; startMonth?: number }) => {
    const response = await subscriptionsApi.getSubscriptions(params);
    return response.data;
  }
);

export const fetchSubscription = createAsyncThunk(
  'subscriptions/fetchSubscription',
  async (id: string) => {
    const response = await subscriptionsApi.getSubscription(id);
    return response.data;
  }
);

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (data: SubscriptionFormData, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.createSubscription(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, data }: { id: string; data: Partial<SubscriptionFormData> }, { rejectWithValue }) => {
    try {
      const response = await subscriptionsApi.updateSubscription(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSubscription = createAsyncThunk(
  'subscriptions/deleteSubscription',
  async (id: string, { rejectWithValue }) => {
    try {
      await subscriptionsApi.deleteSubscription(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    clearSelectedSubscription: (state) => {
      state.selectedSubscription = null;
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
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить подписки';
      })
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubscription = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Не удалось загрузить подписку';
      })
      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.selectedSubscription = action.payload;
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось создать подписку';
      })
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.selectedSubscription = action.payload;
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось обновить подписку';
      })
      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Не удалось удалить подписку';
      });
  },
});

export const { clearSelectedSubscription, clearError, setPage } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;