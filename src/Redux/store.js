import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/user";
import cartReducer from "./Slices/cart";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
  },
});

export default store;
