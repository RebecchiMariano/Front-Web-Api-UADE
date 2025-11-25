import { configureStore, compose } from "@reduxjs/toolkit";
import userReducer from "./Slices/user";
import cartReducer from "./Slices/cart";
import productReducer from "./Slices/product";
import categoryReducer from "./Slices/category";



const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    category: categoryReducer,
  },
});

export default store;
