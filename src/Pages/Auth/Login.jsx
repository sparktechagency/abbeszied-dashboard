import { Checkbox, Form, Input, ConfigProvider, message } from "antd";
import { useNavigate } from "react-router-dom";
import { RiUser2Fill } from "react-icons/ri";
import { MdLock } from "react-icons/md";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const [logIn, { isLoading }] = useLoginMutation();

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const res = await logIn({
        email: email.trim(),
        password: password.trim(),
      }).unwrap();

      if (res.success) {
        console.log("res", res);
        localStorage.setItem("accessToken", res?.data?.accessToken);
        message.success("Login successful!");
        navigate("/");
      } else {
        // Handle case where response is not successful
        message.error(res?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);

      // Handle different error response structures
      let errorMessage = "Login failed";

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
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#fd7d00",
            activeBorderColor: "#fd7d00",
          },
        },
      }}
    >
      <div>
        <div className="text-center mb-8">
          <h1 className="text-[25px] font-semibold mb-2">Sign in</h1>
          <p>Sign in to continue</p>
        </div>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label={
              <p className="text-black font-normal text-base">
                Enter Your Email
              </p>
            }
            rules={[
              {
                required: true,
                message: `Please Enter your email`,
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              placeholder={`Enter Your email`}
              prefix={
                <RiUser2Fill className="border-r-2 w-full h-10 mr-2  p-2 -ml-2 text-abbes " />
              }
              className="h-10 border-[#d9d9d9] outline-none "
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<p className="text-black font-normal text-base">Password</p>}
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              prefix={
                <MdLock className="border-r-2 w-full h-10 mr-2 p-2 -ml-2 text-abbes " />
              }
              placeholder="Enter your password"
              className="h-10 border-[#d9d9d9] outline-none "
            />
          </Form.Item>

          <div className="flex items-center justify-between">
            <Form.Item
              style={{ marginBottom: 0 }}
              name="remember"
              valuePropName="checked"
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a
              className="login-form-forgot text-abbes/80 hover:text-abbes font-semibold"
              href="/auth/forgot-password"
            >
              Forgot password
            </a>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <button
              htmlType="submit"
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                height: 47,
                color: "white",
                fontWeight: "400px",
                fontSize: "18px",
                marginTop: 20,
              }}
              className="flex items-center justify-center bg-abbes hover:bg-abbes/90 disabled:bg-abbes/50 disabled:cursor-not-allowed rounded-lg text-base"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default Login;
