import { api } from "../api/baseApi";

const productSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (eventData) => {
        return {
          url: "/event/create-event",
          method: "POST",
          body: eventData,
        };
      },
      invalidatesTags: ["PRODUCTS"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `products-managments/status-change/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["PRODUCTS"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/products-managments/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["PRODUCTS"],
    }),
    getProducts: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/products-managments?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["PRODUCTS"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductsQuery,
} = productSlice;
