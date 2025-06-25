import { Form, Input, ConfigProvider, message } from "antd";
import { IoMail } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/apiSlices/authSlice";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const onFinish = async (values) => {
    const { email } = values;

    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();

      if (res.success) {
        message.success("OTP sent to your email");
        navigate(`/auth/verify-otp?email=${email.trim()}`);
        localStorage.setItem("forgetToken", res?.data?.forgetToken);
      } else {
        // Handle case where response is not successful
        message.error(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("ForgotPassword Error:", err);

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

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-2">Forgot Password</h1>
        <p className="w-[90%] mx-auto text-base">
          Enter your email below to reset your password
        </p>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelColor: "black",
            },
            Input: {
              hoverBorderColor: "#fd7d00",
              activeBorderColor: "#fd7d00",
            },
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<p className="text-base font-normal">Email</p>}
            name="email"
            id="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              prefix={
                <IoMail className="border-r-2 w-full h-10 mr-2  p-2 -ml-2 text-abbes " />
              }
              className="h-10 border-[#d9d9d9] outline-none "
            />
          </Form.Item>

          <Form.Item>
            <button
              htmlType="submit"
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: 45,
                color: "white",
                fontWeight: "400px",
                fontSize: "18px",
                marginTop: 20,
              }}
              className="flex items-center justify-center bg-abbes hover:bg-abbes/90 disabled:bg-abbes/50 disabled:cursor-not-allowed rounded-lg"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ForgotPassword;
