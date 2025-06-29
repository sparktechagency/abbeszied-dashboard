import { api } from "../api/baseApi";

const cmsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacyPolicy: builder.query({
      query: () => {
        return {
          url: `/settings?title=privacyPolicy`,
          method: "GET",
        };
      },
    }),
    updatePolicies: builder.mutation({
      query: (updated) => {
        return {
          url: `/settings`,
          method: "PUT",
          body: updated,
        };
      },
    }),
    getTermsAndCon: builder.query({
      query: () => {
        return {
          url: `/settings?title=termsOfService`,
          method: "GET",
        };
      },
    }),
    getAboutUs: builder.query({
      query: () => {
        return {
          url: `/settings?title=aboutUs`,
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetPrivacyPolicyQuery,
  useGetTermsAndConQuery,
  useGetAboutUsQuery,
  useUpdatePoliciesMutation,
} = cmsSlice;
