import { Button, Form, Input, ConfigProvider } from "antd";
import React from "react";
import { IoMail } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    navigate(`/auth/verify-otp?email=${values?.email}`);
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
              style={{
                width: "100%",
                height: 45,
                color: "white",
                fontWeight: "400px",
                fontSize: "18px",

                marginTop: 20,
              }}
              className="flex items-center justify-center bg-abbes rounded-lg"
            >
              Send OTP
            </button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ForgotPassword;
