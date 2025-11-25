import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:8080';


export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue, signal, getState }) => {
    try {
      const controller = new AbortController();
      signal.addEventListener('abort', () => controller.abort());
      const token = getState()?.user?.value?.accessToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/categorias/`, { signal: controller.signal, headers });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        let msg = text;
        try {
          const json = text && JSON.parse(text);
          msg = (json && (json.message || json.error)) || text;
        } catch (e) {
        }
        throw new Error(msg || Error `${res.status}`);
      }

      const rawText = await res.clone().text().catch(() => null);
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        data = null;
      }

      if (data === null) {
        try {
          data = await res.json();
        } catch (e) {
          data = null;
        }
      }

      let list = data;
      if (data && !Array.isArray(data) && Array.isArray(data.data)) list = data.data;

      if (!Array.isArray(list)) {
        throw new Error('Respuesta de categorías inválida');
      }

      const active = list
        .filter(c => c && String(c.estado).toUpperCase() === 'ACTIVO')
        .map(c => ({
          id: c.id,
          nombre: c.nombre ?? c.name,
          estado: c.estado,
        }));

      return active;
    } catch (err) {
      if (err.name === 'AbortError') {
        return rejectWithValue('cancelled');
      }
      console.error('[category] fetchCategories - error', err);
      return rejectWithValue(err.message || 'Error al cargar categorías');
    }
  }
);

export const createCategory = createAsyncThunk(
  'category/createCategory',
  async ({ payload, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/categorias/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let body;
      try { body = JSON.parse(text); } catch { body = { message: text }; }

      if (!res.ok) throw new Error(body.message || `Error ${res.status}`);

      return body;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  categories: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearCategories(state) {
      state.categories = [];
      state.status = 'idle';
      state.error = null;
      state.lastFetched = null;
    },
    setCategories(state, action) {
      state.categories = action.payload;
      state.status = 'succeeded';
      state.error = null;
      state.lastFetched = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload === 'cancelled' ? null : action.payload;
      });

      builder
        .addCase(createCategory.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(createCategory.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.categories = [...state.categories, { id: action.payload.id, nombre: action.payload.nombre, estado: action.payload.estado }];
          state.error = null;
        })
        .addCase(createCategory.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
  },
});

export const { clearCategories, setCategories } = categorySlice.actions;

export const selectCategoryState = (state) => state.category || initialState;
export const selectAllCategories = createSelector(
  selectCategoryState,
  (s) => s.categories
);
export const selectActiveCategoryNames = createSelector(
  selectAllCategories,
  (cats) => cats.map(c => c.nombre)
);
export const selectCategoryStatus = createSelector(
  selectCategoryState,
  (s) => s.status
);
export const selectCategoryError = createSelector(
  selectCategoryState,
  (s) => s.error
);

export default categorySlice.reducer;