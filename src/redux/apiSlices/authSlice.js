import { api } from "../api/baseApi";

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (otp) => {
        // Read forgetToken dynamically at the time of request
        const forgetToken = localStorage.getItem("forgetToken");
        return {
          method: "PATCH",
          url: "/auth/forgot-password-otp-match",
          body: otp,
          headers: {
            token: forgetToken,
          },
        };
      },
    }),
    login: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/login",
          body: data,
        };
      },
      transformResponse: (data) => {
        return data;
      },
      transformErrorResponse: ({ data }) => {
        const { message } = data;
        return message;
      },
    }),
    forgotPassword: builder.mutation({
      query: (data) => {
        return {
          method: "POST",
          url: "/auth/forgot-password-otp",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: (password) => {
        // Read forgetOtpMatchToken dynamically at the time of request
        const forgetOtpMatchToken = localStorage.getItem("forgetOtpMatchToken");
        return {
          url: "/auth/forgot-password-reset",
          method: "PATCH",
          body: password,
          headers: {
            token: forgetOtpMatchToken,
          },
        };
      },
    }),

    changePassword: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/auth/change-password",
          body: data,
        };
      },

      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useOtpVerifyMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useProfileQuery,
} = authSlice;
