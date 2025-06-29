import React, { useState, useEffect } from "react";
import { Modal, Form, Upload, message, Select, Input } from "antd";
import { CloudUploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";

const { Option } = Select;

const SliderModal = ({
  isVisible,
  onClose,
  onSubmit,
  isEditing,
  editingData,
  isLoading = false,
}) => {
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Reset form when modal opens/closes or editing data changes
  useEffect(() => {
    if (isVisible) {
      console.log("Modal opened with editingData:", editingData);

      if (isEditing && editingData) {
        // Debug: Log the editingData structure
        console.log("Setting form values:", {
          name: editingData.name,
          type: editingData.type,
          image: editingData.sliderimg,
        });

        // Populate form with editing data
        form.setFieldsValue({
          name: editingData.name || "",
          type: editingData.type || undefined,
        });

        // Set the image preview
        setUploadedImage(editingData.sliderimg || null);
        setImageFile(null);

        // Force form to update its display
        setTimeout(() => {
          form.validateFields();
        }, 100);
      } else {
        // Reset form for new entry
        form.resetFields();
        setUploadedImage(null);
        setImageFile(null);
      }
    }
  }, [isVisible, isEditing, editingData, form]);

  // Additional useEffect to handle form updates
  useEffect(() => {
    if (isVisible && isEditing && editingData) {
      // Force update form fields after modal is fully rendered
      const timer = setTimeout(() => {
        form.setFieldsValue({
          name: editingData.name || "",
          type: editingData.type || undefined,
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [isVisible, isEditing, editingData, form]);

  const handleCancel = () => {
    form.resetFields();
    setUploadedImage(null);
    setImageFile(null);
    onClose();
  };

  const handleFormSubmit = (values) => {
    console.log("Form submitted with values:", values);

    // Validation
    if (!uploadedImage && !isEditing) {
      return message.error("Please upload an image!");
    }

    if (!values.type) {
      return message.error("Please select a type!");
    }

    if (!values.name || values.name.trim() === "") {
      return message.error("Please enter a name!");
    }

    // Prepare form data
    const formData = {
      name: values.name.trim(),
      type: values.type,
      sliderimg: uploadedImage,
      imageFile: imageFile, // Include the actual file for upload
    };

    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;

    if (!file) {
      return message.error("Failed to process the file!");
    }

    if (!file.type.startsWith("image/")) {
      return message.error("You can only upload image files!");
    }

    // Check file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return message.error("Image size must be less than 5MB!");
    }

    // Store the actual file for FormData
    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.onerror = () => {
      message.error("Failed to read the image file!");
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImageFile(null);
  };

  // Custom upload props to prevent automatic upload
  const uploadProps = {
    name: "image",
    listType: "picture-card",
    showUploadList: false,
    beforeUpload: (file) => {
      // Prevent automatic upload
      handleImageUpload({ file });
      return false;
    },
    onChange: (info) => {
      // Handle the upload info if needed
      if (info.file.status !== "uploading") {
        console.log("Upload info:", info);
      }
    },
  };

  return (
    <Modal
      title={isEditing ? "Edit Slider" : "Add Slider"}
      open={isVisible}
      onCancel={handleCancel}
      centered
      footer={null}
      width={500}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="mt-4"
        preserve={false}
        initialValues={
          isEditing && editingData
            ? {
                name: editingData.name || "",
                type: editingData.type || undefined,
              }
            : {}
        }
      >
        {/* Name Input */}
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter a name!",
            },
            {
              min: 2,
              message: "Name must be at least 2 characters long!",
            },
            {
              max: 100,
              message: "Name must be less than 100 characters!",
            },
          ]}
        >
          <Input
            className="w-full h-10"
            placeholder="Enter slider name"
            disabled={isLoading}
          />
        </Form.Item>

        {/* Type Dropdown */}
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
              message: "Please select a type!",
            },
          ]}
        >
          <Select
            placeholder="Select type"
            size="large"
            className="w-full"
            disabled={isLoading}
          >
            <Option value="client">Client</Option>
            <Option value="coach">Coach</Option>
            <Option value="corporate">Corporate</Option>
          </Select>
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Upload Image"
          rules={[
            {
              validator: () => {
                if (!uploadedImage && !isEditing) {
                  return Promise.reject(new Error("Please upload an image!"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          {uploadedImage ? (
            <div className="relative inline-block">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
              {!isLoading && (
                <CloseCircleOutlined
                  className="absolute -top-2 -right-2 text-red-500 cursor-pointer bg-white rounded-full text-lg hover:text-red-700 transition-colors"
                  onClick={removeImage}
                />
              )}
            </div>
          ) : (
            <Upload {...uploadProps} className="w-32 h-32" disabled={isLoading}>
              <button
                style={{ border: 0, background: "none" }}
                type="button"
                className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
              >
                <CloudUploadOutlined className="text-2xl text-gray-400 mb-2" />
                <div className="text-gray-600">Upload Image</div>
              </button>
            </Upload>
          )}
        </Form.Item>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <ButtonEDU
            actionType="cancel"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </ButtonEDU>
          <ButtonEDU actionType="save" htmlType="submit" loading={isLoading}>
            {isEditing ? "Update" : "Save"}
          </ButtonEDU>
        </div>
      </Form>
    </Modal>
  );
};

export default SliderModal;
