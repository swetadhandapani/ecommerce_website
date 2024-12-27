import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: JSON.parse(localStorage.getItem("cartItems")) || [], 
    loading: false,
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
  reducers: {
    addCartItemRequest(state) {
      state.loading = true;
    },
    addCartItemSuccess(state, action) {
      const item = action.payload;
      const isItemExist = state.items.find((i) => i.product === item.product);
      
      if (!isItemExist) {
        state.items.push(item);
      }
      
      state.loading = false;
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    increaseCartItemQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product === action.payload) {
          item.quantity += 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    decreaseCartItemQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product === action.payload) {
          item.quantity -= 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItemFromCart(state, action) {
      state.items = state.items.filter((item) => item.product !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    saveShippingInfo(state, action) {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
    orderCompleted(state) {
      state.items = [];
      state.shippingInfo = {};
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingInfo");
      sessionStorage.removeItem("orderInfo");
      console.log("Order completed, resetting cart...");
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  addCartItemRequest,
  addCartItemSuccess,
  increaseCartItemQty,
  decreaseCartItemQty,
  removeItemFromCart,
  saveShippingInfo,
  orderCompleted,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
