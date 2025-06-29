import { api } from "../api/baseApi";

const userSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => {
        return {
          url: "/users/update-my-profile",
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: ["PROFILE"],
    }),

    profile: builder.query({
      query: () => {
        return {
          url: "/users/my-profile",
          method: "GET",
        };
      },
      providesTags: ["PROFILE"],
    }),
  }),
});

export const { useUpdateProfileMutation, useProfileQuery } = userSlice;
