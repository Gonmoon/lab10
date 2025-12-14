import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { editionsApi, Edition, EditionFormData, PaginatedResponse } from '../../api/editionsApi';

interface EditionState {
  items: Edition[];
  selectedEdition: Edition | null;
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<Edition>['meta'];
}

const initialState: EditionState = {
  items: [],
  selectedEdition: null,
  loading: false,
  error: null,
  pagination: { page: 1, total: 0, totalPages: 0, limit: 10 },
};

export const fetchEditions = createAsyncThunk(
  'editions/fetchEditions',
  async (params: Record<string, any>) => {
    const response = await editionsApi.getEditions(params);
    return response.data;
  }
);

export const fetchEdition = createAsyncThunk(
  'editions/fetchEdition',
  async (id: string) => {
    const response = await editionsApi.getEdition(id);
    return response.data;
  }
);

export const createEdition = createAsyncThunk(
  'editions/createEdition',
  async (payload: EditionFormData) => {
    const response = await editionsApi.createEdition(payload);
    return response.data;
  }
);

export const updateEdition = createAsyncThunk(
  'editions/updateEdition',
  async ({ id, data }: { id: string; data: Partial<EditionFormData> }) => {
    const response = await editionsApi.updateEdition(id, data);
    return response.data;
  }
);

const editionsSlice = createSlice({
  name: 'editions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditions.pending, (state) => { state.loading = true; })
      .addCase(fetchEditions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.meta;
      })
      .addCase(fetchEditions.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки';
      })
      .addCase(fetchEdition.pending, (state) => { state.loading = true; })
      .addCase(fetchEdition.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEdition = action.payload;
      })
      .addCase(fetchEdition.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки';
      })
      .addCase(createEdition.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateEdition.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.selectedEdition = action.payload;
      });
  },
});

export default editionsSlice.reducer;
