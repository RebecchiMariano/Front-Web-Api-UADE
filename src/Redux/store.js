import { configureStore, compose } from "@reduxjs/toolkit";
import userReducer from "./Slices/user";
import cartReducer from "./Slices/cart";
import productReducer from "./Slices/product";

const enhancers = compose(
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );


const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    enhancers,
  },
});

export default store;
