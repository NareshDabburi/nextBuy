export const updateWishlist = (state) => {
  console.log("UPDATE WISHLIST CART ITEM", state.cartItems);
  // Save the cart to localStorage
  localStorage.setItem("wishlist", JSON.stringify(state));
  return state;
};
