import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  message,
  ConfigProvider,
  Select,
} from "antd";
import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";

const { Option } = Select;

function CategoryModal({
  isModalOpen,
  handleCancel,
  onSubmit,
  isEditing,
  editingData,
  isLoading,
}) {
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Reset form and image when modal opens/closes or editing data changes
  useEffect(() => {
    if (isModalOpen) {
      if (isEditing && editingData) {
        form.setFieldsValue({
          name: editingData.name,
          type: editingData.type || "client",
        });
        setUploadedImage(editingData.icon);
        setImageFile(null);
      } else {
        form.resetFields();
        setUploadedImage(null);
        setImageFile(null);
      }
    }
  }, [isModalOpen, isEditing, editingData, form]);

  const handleFormSubmit = (values) => {
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    // Pass the form data and image back to parent
    onSubmit({
      ...values,
      icon: imageFile || uploadedImage, // Use new file if uploaded, otherwise keep existing
    });

    // Reset form and close modal
    form.resetFields();
    setUploadedImage(null);
    setImageFile(null);
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    // Store the actual file for form submission
    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setUploadedImage(null);
    setImageFile(null);
    handleCancel();
  };

  return (
    <Modal
      title={isEditing ? "Edit Category" : "Add Category"}
      open={isModalOpen}
      onCancel={handleModalCancel}
      centered
      footer={null}
      maskClosable={!isLoading}
      closable={!isLoading}
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
            Input: {
              hoverBorderColor: "#fd7d00",
              activeBorderColor: "#fd7d00",
            },
            Select: {
              hoverBorderColor: "#fd7d00",
              activeBorderColor: "#fd7d00",
            },
            token: {
              colorPrimaryHover: "#fd7d00",
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          disabled={isLoading}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the category name!" },
              { min: 2, message: "Name must be at least 2 characters long!" },
              { max: 50, message: "Name must be less than 50 characters!" },
            ]}
          >
            <Input
              placeholder="Enter category name"
              className="h-10"
              disabled={isLoading}
            />
          </Form.Item>

          <Form.Item
            label="Type"
            name="type"
            rules={[
              { required: true, message: "Please select the category type!" },
            ]}
            initialValue="client"
          >
            <Select
              placeholder="Select category type"
              className="h-10"
              disabled={isLoading}
            >
              <Option value="corporate">Client</Option>
              <Option value="coach">Coach</Option>
              <Option value="store">Coach</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Upload Image" required={!isEditing}>
            {uploadedImage ? (
              <div className="relative inline-block">
                <img
                  src={uploadedImage}
                  alt="Category Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                />
                {!isLoading && (
                  <CloseCircleOutlined
                    className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-white rounded-full text-lg hover:text-red-700 transition-colors"
                    onClick={handleRemoveImage}
                  />
                )}
              </div>
            ) : (
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                onChange={handleImageUpload}
                beforeUpload={() => false} // Prevent auto upload
                disabled={isLoading}
                accept="image/*"
              >
                <button
                  style={{ border: 0, background: "none" }}
                  type="button"
                  disabled={isLoading}
                >
                  <CloudUploadOutlined
                    style={{ fontSize: 24 }}
                    className="border rounded-full p-2.5 text-gray-400"
                  />
                  <div className="flex flex-col text-[14px] text-gray-600">
                    <span>Drop your image here or</span>
                    <span className="text-abbes font-medium">
                      Click to upload
                    </span>
                  </div>
                </button>
              </Upload>
            )}
            <div className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF. Max size: 2MB
            </div>
          </Form.Item>

          <div className="flex justify-end w-full">
            <ButtonEDU
              actionType="save"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isEditing ? "Update" : "Save"}
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}

export default CategoryModal;
