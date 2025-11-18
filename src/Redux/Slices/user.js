import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const authenticateUser = createAsyncThunk(
  'user/authenticate',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errorMsg = errorData.message || "Error de credenciales (código: " + res.status + ")";
        throw new Error(errorMsg);
      }

      const result = await res.json();
      return result.access_token; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState: { 
    value: null, 
    status: 'idle', 
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.value = null;
      state.status = 'idle';
      state.error = null;
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token'); 
      localStorage.removeItem('user');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    },
    setUser: (state, action) => {
        state.value = action.payload;
        state.status = 'succeeded';
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = { accessToken: action.payload }; 
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.value = null;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;