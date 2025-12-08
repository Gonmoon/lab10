import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const fetchEditions = createAsyncThunk(
  'editions/fetchEditions',
  async (params = {}, { rejectWithValue }) => {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const { data } = await axiosClient.get(`/editions?${searchParams}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Ошибка загрузки' });
    }
  }
);

export const fetchEditionById = createAsyncThunk(
  'editions/fetchEditionById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(`/editions/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Ошибка загрузки' });
    }
  }
);

export const createEdition = createAsyncThunk(
  'editions/createEdition',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.post('/editions', payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Ошибка создания' });
    }
  }
);

export const updateEdition = createAsyncThunk(
  'editions/updateEdition',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.put(`/editions/${id}`, payload);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Ошибка обновления' });
    }
  }
);

export const deleteEdition = createAsyncThunk(
  'editions/deleteEdition',
  async (id, { rejectWithValue }) => {
    try {
      await axiosClient.delete(`/editions/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Ошибка удаления' });
    }
  }
);

const editionsSlice = createSlice({
  name: 'editions',
  initialState: {
    list: [],
    meta: { total: 0, page: 1, totalPages: 1, limit: 10 },
    loadingList: false,
    listError: null,

    current: null,
    loadingCurrent: false,
    currentError: null,

    saving: false,
    saveError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEditions.pending, state => {
        state.loadingList = true;
        state.listError = null;
      })
      .addCase(fetchEditions.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchEditions.rejected, (state, action) => {
        state.loadingList = false;
        state.listError = action.payload?.message || 'Ошибка';
      })
      .addCase(fetchEditionById.pending, state => {
        state.loadingCurrent = true;
        state.currentError = null;
      })
      .addCase(fetchEditionById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.current = action.payload;
      })
      .addCase(fetchEditionById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.currentError = action.payload?.message || 'Ошибка';
      })
      .addCase(createEdition.pending, state => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(createEdition.fulfilled, (state, action) => {
        state.saving = false;
        state.list.unshift(action.payload);
      })
      .addCase(createEdition.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload?.message || 'Ошибка';
      })
      .addCase(updateEdition.pending, state => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateEdition.fulfilled, (state, action) => {
        state.saving = false;
        state.current = action.payload;
        state.list = state.list.map(item =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateEdition.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload?.message || 'Ошибка';
      })
      .addCase(deleteEdition.fulfilled, (state, action) => {
        state.list = state.list.filter(item => item._id !== action.payload);
      })
      .addCase(deleteEdition.rejected, (state, action) => {
        state.saveError = action.payload?.message || 'Ошибка удаления';
      });
  }
});

export default editionsSlice.reducer;
