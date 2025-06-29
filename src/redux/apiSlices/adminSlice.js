import { api } from "../api/baseApi";

const adminSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (data) => {
        return {
          url: "admin-managments/create-admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["ADMIN"],
    }),
    updateAdmin: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/category/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["ADMIN"],
    }),
    deleteAdmin: builder.mutation({
      query: (id) => {
        return {
          url: `/admin-managments/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["ADMIN"],
    }),
    getAllAdmin: builder.query({
      query: () => {
        return {
          url: "admin-managments/get-admins",
          method: "GET",
        };
      },
      providesTags: ["ADMIN"],
    }),
  }),
});

export const {
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useGetAllAdminQuery,
} = adminSlice;
