import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice.js";
import productReducer from "./slices/productSlice.js";
import authReducer from "./slices/authSlice.js";
import cartReducer from "./slices/cartSlice.js";
import orderReducer from "./slices/orderSlice.js";
import {thunk} from "redux-thunk";
import userReducer from "./slices/userSlice.js"

// Load cart items from localStorage if available
const preloadedState = {
  cartState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [],
  }
};

// Combine all reducers
const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
  userState: userReducer,  
});

// Configure store
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  preloadedState, // Load the preloadedState (cart items) when the store is initialized
});

export default store;
