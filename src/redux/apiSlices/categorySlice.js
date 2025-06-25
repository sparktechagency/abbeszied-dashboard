import { api } from "../api/baseApi";

const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createCategory: builder.mutation({
      query: (categoryData) => {
        return {
          url: "/category/create",
          method: "POST",
          body: categoryData,
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/category/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    category: builder.query({
      query: () => {
        return {
          url: "/category/",
          method: "GET",
        };
      },
      providesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categorySlice;
