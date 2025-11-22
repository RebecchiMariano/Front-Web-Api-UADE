import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ====================================================================
// THUNKS ASÍNCRONOS
// ====================================================================

export const fetchCartAsync = createAsyncThunk(
  'cart/fetchCart',
  async (accessToken, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:8080/compras/", {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      const compras = await res.json();
      
      // ANTES: const carritoActivo = compras.find(compra => compra.estado === 'PENDIENTE'); // FALLA aquí
      
      // SOLUCIÓN RAPIDA: Asumir el primer elemento es el carrito activo (si lo hay)
      const carritoActivo = (Array.isArray(compras) && compras.length > 0) ? compras[0] : null; 
      
      return carritoActivo || { items: [] }; 
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ productoId, cantidad, accessToken, productData }, { rejectWithValue, dispatch }) => {
    try {
      const carritoRequest = { productoId: productoId, cantidad: cantidad };

      const res = await fetch('http://localhost:8080/compras/carrito/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(carritoRequest)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      await dispatch(fetchCartAsync(accessToken));

      return { product: productData, quantity: cantidad };

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/updateItem',
  async ({ productoId, cantidad, accessToken, successMessage }, { dispatch, rejectWithValue }) => {
    try {
      const carritoRequest = { productoId, cantidad };

      const res = await fetch('http://localhost:8080/compras/carrito/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(carritoRequest)
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      await dispatch(fetchCartAsync(accessToken));

      return successMessage;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkoutAsync = createAsyncThunk(
  'cart/checkout',
  async (accessToken, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8080/compras/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const compraConfirmada = await res.json();
      return compraConfirmada;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    value: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clear: (state) => {
      state.value = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- 1. Handlers de Fetch Cart ---
      .addCase(fetchCartAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload?.items ?? [];
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- 2. Handlers de Checkout ---
      .addCase(checkoutAsync.pending, (state) => {
        state.status = 'checkingOut';
        state.error = null;
      })
      .addCase(checkoutAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.value = [];
      })
      .addCase(checkoutAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- 3. Handlers de Matcher ---
      .addMatcher(
        (action) => [updateCartItemAsync.pending.type, addToCartAsync.pending.type].includes(action.type),
        (state) => { state.status = 'loading'; }
      )
      .addMatcher(
        (action) => [updateCartItemAsync.fulfilled.type, addToCartAsync.fulfilled.type].includes(action.type),
        (state) => { state.status = 'succeeded'; state.error = null; }
      )
      .addMatcher(
        (action) => [updateCartItemAsync.rejected.type, addToCartAsync.rejected.type].includes(action.type),
        (state, action) => { state.status = 'failed'; state.error = action.payload; }
      );


  },
});

export const { clear } = cartSlice.actions;
export default cartSlice.reducer;