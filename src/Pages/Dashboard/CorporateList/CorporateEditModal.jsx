import React, { useEffect, useState } from "react";
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

const CorporateEditModal = ({
  isModalOpen,
  handleCancel,
  providerData,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (providerData) {
      form.setFieldsValue(providerData);
    }
  }, [providerData, form]);

  const handleFormSubmit = (values) => {
    const updatedProvider = { ...providerData, ...values };
    if (uploadedImage) {
      updatedProvider.avatar = uploadedImage;
    }
    onSave(updatedProvider);
  };

  useEffect(() => {
    if (providerData) {
      form.setFieldsValue(providerData);
    }
  }, [providerData, form]);

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

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
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
        title="Edit Corporate"
        open={isModalOpen}
        onCancel={handleCancel}
        centered
        footer={[
          <div className="w-full flex justify-end" key="footer-buttons">
            <ButtonEDU actionType="cancel" onClick={handleCancel}>
              Cancel
            </ButtonEDU>
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
            label={<p className="font-medium text-black">Corporate Name</p>}
            name="corporateName"
            rules={[
              { required: true, message: "Corporate's Name is required" },
            ]}
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
            label={<p className="font-medium text-black">Job Post</p>}
            name="jobPost"
            rules={[{ required: true, message: "Job Post is required" }]}
          >
            <Input className="h-9 text-sm" />
          </Form.Item>

          <Form.Item label="Upload Profile Picture">
            <Upload
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Avatar Preview"
                className="mt-2 w-16 h-16 rounded-full border"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </ConfigProvider>
  );
};

export default CorporateEditModal;
