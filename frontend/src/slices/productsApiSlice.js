import { PRODUCT_URL } from "../constants";
import { apiSlice } from "./apiSlices";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/getAllProducts`,
      }),
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/getProduct/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});
export const { useGetProductsQuery, useGetProductDetailsQuery } =
  productApiSlice;
