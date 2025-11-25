import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

// Endpoint base (puedes moverlo a .env más adelante)
const API_BASE = 'http://localhost:8080';


export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue, signal, getState }) => {
    try {
      const controller = new AbortController();
      signal.addEventListener('abort', () => controller.abort());
      // Obtener token (si existe) desde el state para endpoints protegidos
      const token = getState()?.user?.value?.accessToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      console.log('[category] fetchCategories - iniciando petición a', `${API_BASE}/categorias/`, { tokenPresent: !!token });

      const res = await fetch(`${API_BASE}/categorias/`, { signal: controller.signal, headers });
      if (!res.ok) {
        const text = await res.text().catch(() => null);
        let msg = text;
        try {
          const json = text && JSON.parse(text);
          msg = (json && (json.message || json.error)) || text;
        } catch (e) {
          // not json -> keep text
        }
        throw new Error(msg || Error `${res.status}`);
      }

      // Intentar parsear JSON (y también guardar raw para debugging)
      const rawText = await res.clone().text().catch(() => null);
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        // no-json
        data = null;
      }

      // Si no pudimos parsear por JSON, intentar usar res.json() (seguros)
      if (data === null) {
        try {
          data = await res.json();
        } catch (e) {
          // dejar data como null si tampoco funciona
          data = null;
        }
      }

      // Algunos backends envuelven la lista dentro de { data: [...] } u otro campo
      let list = data;
      if (data && !Array.isArray(data) && Array.isArray(data.data)) list = data.data;

      if (!Array.isArray(list)) {
        throw new Error('Respuesta de categorías inválida');
      }

      // Filtrar solo activas y normalizar formato
      const active = list
        .filter(c => c && String(c.estado).toUpperCase() === 'ACTIVO')
        .map(c => ({
          id: c.id,
          nombre: c.nombre ?? c.name,
          estado: c.estado,
        }));

      return active;
    } catch (err) {
      // Si fue abortado, propagar como rechazo "aborted" (opcional)
      if (err.name === 'AbortError') {
        return rejectWithValue('cancelled');
      }
      console.error('[category] fetchCategories - error', err);
      return rejectWithValue(err.message || 'Error al cargar categorías');
    }
  }
);

const initialState = {
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  lastFetched: null, // timestamp opcional para caching
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
    // opcional: setCategories para tests o bootstrap desde SSR
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
  },
});

export const { clearCategories, setCategories } = categorySlice.actions;

// Selectores
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