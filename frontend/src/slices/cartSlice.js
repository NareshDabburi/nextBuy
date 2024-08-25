import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);
      const item = action.payload;
      const existsItem = state.cartItems.find((x) => x._id === item._id);
      if (existsItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existsItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      console.log("ADDTOCART", state.cartItems);
      return updateCart(state);
    },
    initializeCartItems: (state, action) => {
      state = {
        cartItems: [],
        shippingAddress: {},
        paymentMethod: "PayPal",
      };
      state.cartItems = action.payload;
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
    resetCart: (state, action) => (state) => initialState,
  },
});

export const {
  addToCart,
  initializeCartItems,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions;
export default cartSlice.reducer;
