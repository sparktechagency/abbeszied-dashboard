import { api } from "../api/baseApi";
const forgetToken = localStorage.getItem("forgetToken");
const forgetOtpMatchToken = localStorage.getItem("forgetOtpMatchToken");

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    otpVerify: builder.mutation({
      query: (otp) => {
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
      query: ({ newPassword, confirmPassword }) => {
        return {
          url: "/auth/forgot-password-reset",
          method: "PATCH",
          body: { newPassword, confirmPassword },
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

    updateProfile: builder.mutation({
      query: (data) => {
        return {
          method: "PATCH",
          url: "/user/profile",
          body: data,
        };
      },
    }),

    profile: builder.query({
      query: () => {
        return {
          method: "GET",
          url: "/user/profile",
        };
      },
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
