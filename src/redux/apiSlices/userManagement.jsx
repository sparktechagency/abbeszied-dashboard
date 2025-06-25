import { api } from "../api/baseApi";

const userManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/category/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["CATEGORY"],
    }),
    getUserByRole: builder.query({
      query: ({ role, page, limit, searchTerm }) => {
        // Build query parameters
        const params = new URLSearchParams();
        params.append("role", role);
        params.append("page", page);
        params.append("limit", limit);

        // Only add searchTerm if it exists and is not empty
        if (searchTerm && searchTerm.trim() !== "") {
          params.append("searchTerm", searchTerm);
        }

        return {
          url: `/user-managments?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["CATEGORY"],
    }),
  }),
});

export const {
  useGetUserByRoleQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementSlice;
