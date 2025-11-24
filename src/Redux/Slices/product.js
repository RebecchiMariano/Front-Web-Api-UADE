import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ====================================================================
// THUNKS ASÍNCRONOS
// ====================================================================

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ category, search, accessToken }, { rejectWithValue }) => {
    try {
      let url = 'http://localhost:8080/productos/todos';

      // 1. Determinar la URL basada en los parámetros
      if (category) {
        url = `http://localhost:8080/productos/categoria/nombre/${encodeURIComponent(category)}`;
      } else if (search) {
        url = `http://localhost:8080/productos/buscar?q=${encodeURIComponent(search)}`;
      }

      // 2. Definir los headers, incluyendo el token de autorización
      const headers = {
        'Content-Type': 'application/json',
      };

      // Solo incluimos el token si lo recibimos (aunque para /todos debe ser obligatorio si está protegido)
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(url, { headers }); // ⬅️ Pasar los headers

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Error ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
      

      return data.map((producto) => ({
        id: producto.id,
        name: producto.nombre,
        category: producto.categoria?.nombre || "Sin categoría",
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


// 1. Obtener un producto por ID (para edición administrativa)

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



// 2. Obtener la lista de categorías (reutilizable)

export const fetchCategories = createAsyncThunk(

  'product/fetchCategories',

  async (accessToken, { rejectWithValue }) => {

    try {

      const res = await fetch("http://localhost:8080/categorias/", {

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${accessToken}`,

        },

        // credentials: "include" ya no es necesario si solo pasas el token

      });



      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();


      // Mapear y filtrar categorías activas

      return data.filter(c => c.estado === "ACTIVO");

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }

);



// 3. Actualizar un producto existente

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



      return await res.json(); // Devuelve el producto actualizado

    } catch (error) {

      return rejectWithValue(error.message);

    }

  }

);


const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    categories: [],
    selectedProduct: null,
    status: 'idle',
    updateStatus: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- HANDLERS PARA fetchProducts (Para la lista de admin) ---
      .addCase(fetchProducts.pending, (state) => {
        // Usamos este status para la lista principal de productos
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload; // Cargar la lista de productos
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Handlers para fetchCategories ---
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error("Error al cargar categorías:", action.payload);
        state.categories = [];
      })

      // --- Handlers para fetchProductById (Para el formulario de edición) ---
      .addCase(fetchProductById.pending, (state) => {
        // Podemos usar un estado separado o reusar 'status' para esta carga específica
        state.status = 'loading';
        state.selectedProduct = null;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Handlers para updateProduct ---
      .addCase(updateProduct.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.selectedProduct = action.payload;

        // Actualizar la lista de productos (products) después de la edición exitosa
        state.products = state.products.map(p =>
          p.id === action.payload.id ? {
            ...p,
            name: action.payload.nombre,
            price: action.payload.valor,
            cantidad: action.payload.cantidad,
            estado: action.payload.estado
          } : p
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;