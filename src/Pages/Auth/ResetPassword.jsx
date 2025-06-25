import { Button, Form, Input, ConfigProvider } from "antd";
import { MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/apiSlices/authSlice";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [resetPassword] = useResetPasswordMutation();

  const onFinish = async (values) => {
    const { newPassword, confirmPassword } = values;
    const token = localStorage.getItem("resetToken");
    console.log("resetToken", token);

    try {
      const res = await resetPassword({
        newPassword,
        confirmPassword,
      }).unwrap();

      if (res.success) {
        message.success("Password reset successful");
        localStorage.removeItem("resetToken");
        navigate(`/auth/login`);
      } else {
        message.error("Password reset failed");
      }
    } catch (err) {
      message.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[25px] font-semibold mb-6">Reset Password</h1>
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
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="flex flex-col gap-3"
        >
          <Form.Item
            name="newPassword"
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="email"
                className="text-base font-normal text-black"
              >
                New Password
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please input your new Password!",
              },
            ]}
            style={{ marginBottom: 6 }}
          >
            <Input.Password
              type="password"
              prefix={
                <MdLock className="border-r-2 w-full h-10 mr-2  p-2 -ml-2 text-abbes " />
              }
              placeholder="Enter New password"
              // className="border-[#E0E4EC] hover:border-abbes h-10 bg-white rounded-lg outline-none "
              className="border-[#E0E4EC] focus:border-orange-500 hover:border-orange-500 h-10 bg-white rounded-lg outline-none"
            />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: 0 }}
            label={
              <p
                style={{
                  display: "block",
                }}
                htmlFor="email"
                className="text-base text-black font-normal"
              >
                Confirm Password
              </p>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              prefix={
                <MdLock className="border-r-2 w-full h-10 mr-2  p-2 -ml-2 text-abbes " />
              }
              placeholder="Enter Confirm password"
              // style={{
              //   border: "1px solid #E0E4EC",
              //   height: "52px",
              //   background: "white",
              //   borderRadius: "8px",
              //   outline: "none",
              // }}
              // className="border-[#E0E4EC] hover:border-abbes h-10 bg-white rounded-lg outline-none "
              className="border-[#E0E4EC] focus:border-orange-500 hover:border-orange-500 h-10 bg-white rounded-lg outline-none"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              htmlType="submit"
              style={{
                width: "100%",
                height: 45,
                color: "white",
                fontWeight: "400px",
                fontSize: "18px",
                border: "1px solid #fc7d01",
                background: "#fc7d01 ",
                marginTop: 20,
              }}
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ResetPassword;
