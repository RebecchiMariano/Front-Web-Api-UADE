import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { value: [] },
  reducers: {
    add: (state, action) => {
      const item = state.value.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.value.push({ ...action.payload, quantity: 1 });
      }
    },
    reduce: (state, action) => {
      const item = state.value.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity -= 1;
      }
      state.value = state.value.filter((item) => item.quantity > 0);
    },
    remove: (state, action) => {
      state.value = state.value.filter((item) => item.id !== action.payload.id);
    },
    clear: (state) => {
      state.value = [];
    },
  },
});

export const { add, reduce, remove, clear } = cartSlice.actions;
export default cartSlice.reducer;
