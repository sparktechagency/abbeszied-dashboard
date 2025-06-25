import { Button, Form, Typography, message } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import {
  useOtpVerifyMutation,
  useForgotPasswordMutation,
} from "../../redux/apiSlices/authSlice";
const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [otpVerification, { isLoading }] = useOtpVerifyMutation();
  const [forgotPassword, { isLoading: isResending }] =
    useForgotPasswordMutation();
  const email = new URLSearchParams(window.location.search).get("email");

  const onFinish = async () => {
    if (!otp || otp.length < 4) {
      return message.warning("Please enter the complete 4-digit OTP");
    }

    try {
      const res = await otpVerification({
        otp: otp,
      }).unwrap();

      if (res.success) {
        message.success("OTP verification successful");
        localStorage.setItem(
          "forgetOtpMatchToken",
          res?.data?.forgetOtpMatchToken
        );
        navigate(`/auth/reset-password?email=${email}`);
      } else {
        message.error(res?.message || "OTP verification failed");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);

      // Handle different error response structures
      let errorMessage = "Something went wrong";

      if (err?.data?.message) {
        // RTK Query error with data.message
        errorMessage = err.data.message;
      } else if (err?.message) {
        // Direct error message
        errorMessage = err.message;
      } else if (err?.data?.errorSources?.length > 0) {
        // Handle errorSources array
        errorMessage = err.data.errorSources[0].message;
      } else if (typeof err === "string") {
        // String error
        errorMessage = err;
      }

      message.error(errorMessage);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      message.error("Email not found. Please go back and try again.");
      return;
    }

    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();

      if (res.success) {
        message.success("OTP sent to your email again");
        setOtp(""); // Clear the current OTP input
      } else {
        message.error(res?.message || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend OTP Error:", err);

      // Handle different error response structures
      let errorMessage = "Failed to resend OTP";

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.errorSources?.length > 0) {
        errorMessage = err.data.errorSources[0].message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      message.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-[25px] font-semibold mb-2">Verify OTP</h1>
        <p className="w-[80%] mx-auto">
          We'll send a verification code to your email. Check your inbox and
          enter the code here.
        </p>
        {email && (
          <p className="text-sm text-gray-600 mt-2">
            Code sent to: <span className="font-medium">{email}</span>
          </p>
        )}
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputStyle={{
              height: 50,
              width: 50,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "1px solid #fc7d01",
              color: "#fc7d01",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Text>Don't received code?</Text>

          <p
            onClick={handleResendEmail}
            className="login-form-forgot font-medium hover:opacity-80 transition-opacity"
            style={{
              color: "#fc7d01",
              cursor: isResending ? "not-allowed" : "pointer",
              opacity: isResending ? 0.6 : 1,
            }}
          >
            {isResending ? "Resending..." : "Resend"}
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            loading={isLoading}
            disabled={!otp || otp.length < 4}
            style={{
              width: "100%",
              height: 45,
              border: "1px solid #fc7d01",
              outline: "none",
              boxShadow: "none",
              background: "#fc7d01",
              color: "white",
            }}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;
