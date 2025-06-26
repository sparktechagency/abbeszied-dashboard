import { api } from "../api/baseApi";

const certificateSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    approveOrReject: builder.mutation({
      query: ({ id, verifiedByAdmin }) => {
        return {
          url: `/certificate-managments/${id}`,
          method: "PATCH",
          body: verifiedByAdmin,
        };
      },
    }),

    getCertificates: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/certificate-managments?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useApproveOrRejectMutation, useGetCertificatesQuery } =
  certificateSlice;
