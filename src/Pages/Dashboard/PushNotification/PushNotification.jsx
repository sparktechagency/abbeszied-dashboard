import React, { useState } from "react";
import { Button, Dropdown, Form, Input, Menu, ConfigProvider } from "antd";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegPaperPlane } from "react-icons/fa6";
// import purle from "../../../assets/gtdandy/purple.jpg";
function PushNotification() {
  const [form] = Form.useForm();
  const [selectedRecipient, setSelectedRecipient] = useState("All Users");

  // Dropdown menu items
  const items = [
    {
      label: "All Users",
      key: "0",
    },
    {
      label: "Customers Only",
      key: "1",
    },
    {
      label: "Service Providers Only",
      key: "2",
    },
  ];

  // Handle dropdown selection
  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key === e.key);
    if (selected) {
      setSelectedRecipient(selected.label);
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    console.log("Form Values:", {
      ...values,
      recipient: selectedRecipient,
    });
  };

  return (
    <>
      <div className="p-10 bg-white shadow-md rounded-md max-w-lg mx-auto">
        <h1 className="text-[24px] font-semibold mb-4 border-b-2">
          Send Push Notification
        </h1>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelFontSize: 16,
              },
              Input: {
                hoverBorderColor: "#fc7d01",
                activeBorderColor: "#fc7d01",
              },
              Button: {
                defaultActiveBorderColor: "#fc7d01",
                defaultHoverBorderColor: "#fc7d01",
                defaultHoverColor: "#fc7d01",
              },
            },
          }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Title */}
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input
                placeholder="Enter notification title..."
                className="h-11"
              />
            </Form.Item>

            {/* Message Details */}
            <Form.Item
              label="Message Details"
              name="message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter notification message..."
              />
            </Form.Item>

            {/* Recipient Type Dropdown */}
            <Form.Item label="Select Recipient Type" name="recipient">
              <Dropdown
                overlay={<Menu onClick={handleMenuClick} items={items} />}
                trigger={["click"]}
                className="h-9"
              >
                <Button className="w-full text-left bg-gradient-to-b from-[#00017d]/5 via-white to-[#00017d]/5 ">
                  {selectedRecipient}
                  <IoMdArrowDropdown size={20} />
                </Button>
              </Dropdown>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="block"
                htmlType="submit"
                className="w-full bg-abbes hover:bg-abbes/85 text-white h-11 text-base gap-4"
              >
                Send Notification
                <FaRegPaperPlane />
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </>
  );
}

export default PushNotification;
