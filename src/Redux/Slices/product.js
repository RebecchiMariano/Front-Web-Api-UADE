import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ====================================================================
// THUNKS ASÍNCRONOS
// ====================================================================

// =====================================================
// 1) LISTAR PRODUCTOS
// =====================================================
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ category, search, accessToken }, { rejectWithValue }) => {
    try {
      let url = 'http://localhost:8080/productos/todos';

      if (category) {
        url = `http://localhost:8080/productos/categoria/nombre/${encodeURIComponent(category)}`;
      } else if (search) {
        url = `http://localhost:8080/productos/buscar?q=${encodeURIComponent(search)}`;
      }

      const headers = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const data = await response.json();
      return data.map((producto) => ({
        id: producto.id,
        name: producto.nombre,
        category: producto?.categoriaNombre || "Sin categoría",
        categoryId: producto.categoria?.id,
        img: producto.foto || "/img/default.jpg",
        price: producto.valor,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
        estado: producto.estado
      }));

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// =====================================================
// 2) CREAR PRODUCTO
// =====================================================
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ payload, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8080/productos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let body;

      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }

      if (!res.ok) throw new Error(body.message || `Error ${res.status}`);

      return body;
      
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


// =====================================================
// 3) PRODUCTO POR ID
// =====================================================
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async ({ id, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8080/productos/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(errorBody || `Error ${res.status}`);
      }

      return await res.json();

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// =====================================================
// 4) CATEGORÍAS (TEMPORALMENTE SIGUE AQUÍ)
// =====================================================
export const fetchCategories = createAsyncThunk(
  'product/fetchCategories',
  async (accessToken, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8080/categorias/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      return data.filter(c => c.estado === "ACTIVO");

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// =====================================================
// 5) EDITAR PRODUCTO
// =====================================================
export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async ({ id, payload, accessToken }, { rejectWithValue }) => {
    try {
      const res = await fetch(`http://localhost:8080/productos/editar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `Error ${res.status}`);
      }

      return await res.json();

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// ====================================================================
// SLICE PRINCIPAL
// ====================================================================

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    categories: [],
    selectedProduct: null,
    status: 'idle',
    detailStatus: 'idle',
    updateStatus: 'idle',
    error: null,
    detailError: null,
    updateError: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // =====================================================
      // LISTAR PRODUCTOS
      // =====================================================
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })


      // =====================================================
      // CARGAR CATEGORÍAS
      // =====================================================
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error("Error al cargar categorías:", action.payload);
        state.categories = [];
      })


      // =====================================================
      // PRODUCTO POR ID
      // =====================================================
      .addCase(fetchProductById.pending, (state) => {
        state.detailStatus = 'loading';
        state.selectedProduct = null;
        state.detailError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailStatus = 'failed';
        state.detailError = action.payload;
      })


      // =====================================================
      // 🟢 NUEVO: CREAR PRODUCTO
      // =====================================================
      .addCase(createProduct.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';

        state.products = [
          ...state.products,
          {
            id: action.payload.id,
            name: action.payload.nombre,
            category: action.payload.categoria?.nombre || "Sin categoría",
            categoryId: action.payload.categoria?.id,
            img: action.payload.foto || "/img/default.jpg",
            price: action.payload.valor,
            descripcion: action.payload.descripcion,
            cantidad: action.payload.cantidad,
            descuento: action.payload.descuento,
            estado: action.payload.estado
          }
        ];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      })


      // =====================================================
      // 🟢 NUEVO: EDITAR PRODUCTO COMPLETO
      // =====================================================
      .addCase(updateProduct.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.selectedProduct = action.payload;

        state.products = state.products.map(p =>
          p.id === action.payload.id
            ? {
                ...p,
                name: action.payload.nombre,
                descripcion: action.payload.descripcion,
                price: action.payload.valor,
                cantidad: action.payload.cantidad,
                descuento: action.payload.descuento,
                estado: action.payload.estado,
                category: action.payload.categoria?.nombre || "Sin categoría",
                categoryId: action.payload.categoria?.id,
                img: action.payload.foto || "/img/default.jpg"
              }
            : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
