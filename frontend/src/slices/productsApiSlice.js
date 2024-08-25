import { PRODUCT_URL, WISHLIST_URL, USERS_URL } from "../constants";
import { apiSlice } from "./apiSlices";
import { UPLOAD_URL } from "../constants";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: `${PRODUCT_URL}/getAllProducts`,
        params: {
          keyword,
          pageNumber,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/getProduct/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
    saveCartItems: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/saveCart`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getLoggedInUserCartItems: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/getCart`,
      }),
      keepUnusedDataFor: 5,
    }),
    saveWishListItems: builder.mutation({
      query: (data) => ({
        url: `${WISHLIST_URL}/addToWishlist`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getLoggedInUserWishListItems: builder.query({}),
  }),
});
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useSaveCartItemsMutation,
  useGetLoggedInUserCartItemsQuery,
  useSaveWishListItemsMutation,
  useGetLoggedInUserWishListItemsQuery,
} = productApiSlice;
