import { createSlice } from "@reduxjs/toolkit";
import { updateWishlist } from "../utils/wishListUtils";

const initialState = localStorage.getItem("wishlist")
  ? JSON.parse(localStorage.getItem("wishlist"))
  : { wishlistItems: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishist: (state, action) => {
      const item = action.payload;
      const existsItem = state.wishlistItems.find((x) => x._id === item._id);
      if (existsItem) {
        state.wishlistItems = state.wishlistItems.map((x) =>
          x._id === existsItem._id ? item : x
        );
      } else {
        state.wishlistItems = [...state.wishlistItems, item];
      }
      return updateWishlist(state);
    },
    initializeWishlistItems: (state, action) => {
      state = {
        wishlistItems: [],
      };
      const items = action.payload;
      state.wishlistItems = items;
      return updateWishlist(state);
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(
        (x) => x._id !== action.payload
      );
    },
    resetWishlist: (state, action) => (state) => initialState,
  },
});

export const {
  addToWishist,
  initializeWishlistItems,
  removeFromWishlist,
  resetWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
