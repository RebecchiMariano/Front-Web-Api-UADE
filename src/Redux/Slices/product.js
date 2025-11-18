import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { category, search } = params;
      let url = 'http://localhost:8080/productos/todos';

      if (category) {
        url = `http://localhost:8080/productos/categoria/nombre/${encodeURIComponent(category)}`;
      } else if (search) {
        url = `http://localhost:8080/productos/buscar?q=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }
      const data = await response.json();

      const mapped = data.map((producto) => ({
        id: producto.id,
        name: producto.nombre,
        category: producto.categoria?.nombre || "Sin categoría",
        categoryId: producto.categoria?.id,
        img: producto.foto || "/img/default.jpg",
        price: producto.valor,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
      }));

      return mapped;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // agregar reducers síncronos (ej: clearProducts)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;