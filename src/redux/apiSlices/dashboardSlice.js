import { api } from "../api/baseApi";

const dashboardSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    clientCoachGraph: builder.query({
      query: ({ year }) => ({
        url: `/dashboard/graph${year ? `?year=${year}` : ""}`,
        method: "GET",
      }),

      providesTags: ["DashboardGraph"],
    }),
    dashboardAnalysis: builder.query({
      query: () => ({
        url: `/dashboard/analysis`,
        method: "GET",
      }),

      providesTags: ["DashboardGraph"],
    }),
  }),
});

export const { useClientCoachGraphQuery,useDashboardAnalysisQuery } = dashboardSlice;
