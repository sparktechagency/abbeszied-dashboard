import { api } from "../api/baseApi";

const userManagementSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `/user-managments/status/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["USER_MANAGEMENT"],
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["USER_MANAGEMENT"],
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
      providesTags: ["USER_MANAGEMENT"],
    }),
  }),
});

export const {
  useGetUserByRoleQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userManagementSlice;
