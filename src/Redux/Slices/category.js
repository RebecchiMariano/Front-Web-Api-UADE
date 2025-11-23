import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategories = createAsyncThunk(

  'category/fetchCategories',
  

  async (_, { rejectWithValue }) => {
    try {
  
      const response = await fetch('http://localhost:8080/categorias/');
      
     
      if (!response.ok) {
        throw new Error('Error al obtener categorías');
      }
      
     
      const data = await response.json();
      
      
      const activeCategories = data.filter(cat => cat.estado === 'ACTIVO');
      
     
      return activeCategories;
      
    } catch (error) {
      
      return rejectWithValue(error.message);
    }
  }
);


const categorySlice = createSlice({
  
  name: 'category',
  
  
  initialState: {
    categories: [],       
    status: 'idle',      
    error: null,          
  },
  
  
  reducers: {
   
    clearCategories: (state) => {
      state.categories = [];
      state.status = 'idle';
      state.error = null;
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
      })
      
      // Cuando fetchCategories FALLÓ
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';             
        state.error = action.payload;         
        state.categories = [];                
      });
  },
});


export const { clearCategories } = categorySlice.actions;


export default categorySlice.reducer;