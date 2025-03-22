import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Upload,
  message,
  ConfigProvider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";

const ServiceEditModal = ({
  isModalOpen,
  handleCancel,
  providerData,
  onSave,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (providerData) {
      form.setFieldsValue(providerData);
    }
  }, [providerData, form]);

  const handleFormSubmit = (values) => {
    const updatedProvider = { ...providerData, ...values };
    onSave(updatedProvider);
  };

  const validatePhoneNumber = (_, value) => {
    const phoneRegex = /^[0-9]+$/;
    if (!value) {
      return Promise.reject(new Error("Phone number is required"));
    }
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error("Phone number must be numeric"));
    }
    if (value.length < 10 || value.length > 15) {
      return Promise.reject(
        new Error("Phone number must be between 10 and 15 digits")
      );
    }
    return Promise.resolve();
  };

  const validateEarnings = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Earnings amount is required"));
    }
    if (isNaN(value)) {
      return Promise.reject(new Error("Earnings must be a number"));
    }
    if (parseFloat(value) < 0) {
      return Promise.reject(new Error("Earnings cannot be negative"));
    }
    return Promise.resolve();
  };

  const validateEmail = (_, value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!value) {
      return Promise.reject(new Error("Email is required"));
    }
    if (!emailRegex.test(value)) {
      return Promise.reject(
        new Error("Please enter a valid .com email address")
      );
    }
    return Promise.resolve();
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBorderColor: "#fd7d00",
            activeBorderColor: "#fd7d00",
          },
          Button: {
            defaultBg: "transparent",
            defaultHoverBg: "#fd7d00",
            defaultHoverBorderColor: "none",
            defaultColor: "black",
            defaultActiveBorderColor: "none",
            defaultActiveColor: "black",
          },
        },
      }}
    >
      <Modal
        title="Edit Service Provider"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        footer={[
          <div className="w-full flex justify-end">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
            ,
            <ButtonEDU
              actionType="save"
              type="primary"
              onClick={() => form.submit()}
            >
              Save Changes
            </ButtonEDU>
          </div>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label={<p className="font-medium text-black">Coach Name</p>}
            name="coachName"
            rules={[{ required: true, message: "Coachs's Name is required" }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item
            label={<p className="font-medium text-black">Email</p>}
            name="email"
            rules={[{ validator: validateEmail }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item
            label={<p className="font-medium text-black">Category</p>}
            name="category"
            rules={[{ required: true, message: "Category is required" }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item
            label={<p className="font-medium text-black">Phone Number</p>}
            name="phoneNumber"
            rules={[{ validator: validatePhoneNumber }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item
            label={<p className="font-medium text-black">Address</p>}
            name="address"
            rules={[{ required: true, message: "Address is required" }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item
            label={<p className="font-medium text-black">Earnings</p>}
            name="earn"
            rules={[{ validator: validateEarnings }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>
          <Form.Item label="Upload Profile Picture">
            <Upload beforeUpload={beforeUpload} maxCount={1}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default ServiceEditModal;
