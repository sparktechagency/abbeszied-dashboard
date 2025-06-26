import { api } from "../api/baseApi";

const bannerSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    createBanner: builder.mutation({
      query: (bannerData) => {
        return {
          url: "/banner/",
          method: "POST",
          body: bannerData,
        };
      },
      invalidatesTags: ["Banner"],
    }),

    updateBanner: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/banner/${id}`,
          method: "PATCH", // or PATCH depending on your API
          body: data,
        };
      },
      invalidatesTags: ["Banner"],
    }),

    deleteBanner: builder.mutation({
      query: (id) => {
        return {
          url: `/banner/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Banner"],
    }),

    getBanners: builder.query({
      query: (type) => {
        return {
          url: `/banner/?type=${type}`,
          method: "GET",
        };
      },
      transformResponse: ({ data }) => {
        return data;
      },
      providesTags: ["Banner"],
    }),

    updateStatus: builder.mutation({
      query: (id) => {
        return {
          url: `/banner/${id}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Banner"],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useGetBannersQuery,
  useUpdateStatusMutation,
} = bannerSlice;
