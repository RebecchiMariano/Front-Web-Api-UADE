import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Slices/user";
import cartReducer from "./Slices/cart";
import productReducer from "./Slices/product";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
  },
});

export default store;
