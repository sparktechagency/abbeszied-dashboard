import { api } from "../api/baseApi";

const bookingSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookingAnalysis: builder.query({
      query: ({ dateFilter }) => {
        return {
          url: `/booking/analysis?dateFilter=${dateFilter}`, //dateFilter=last30Days
          method: "GET",
        };
      },
      providesTags: ["BOOKING"],
    }),
    getAllBooking: builder.query({
      query: ({ page, limit }) => {
        return {
          url: `/booking?page=${page}&limit=${limit}`,
          method: "GET",
        };
      },
      providesTags: ["BOOKING"],
    }),
  }),
});

export const { useGetBookingAnalysisQuery, useGetAllBookingQuery } =
  bookingSlice;
