import React from "react";
import { Modal, Form, Input, Upload, ConfigProvider, message } from "antd";
import { CloseCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";

function EditSpecServiceModal({
  isEditing,
  isModalOpen,
  setIsModalOpen,
  uploadedImage,
  setUploadedImage,
  form,
  handleFormSubmit,
  handleCancel,
  handleImageUpload,
}) {
  const handleFormSubmitWithValidation = async (values) => {
    // Validate fields
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    if (!values.serviceName || !values.price) {
      message.error("Please fill in all required fields!");
      return;
    }

    // Call the provided handleFormSubmit function
    handleFormSubmit(values);
  };

  return (
    <Modal
      title={isEditing ? "Edit Service" : "Add Service"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelFontSize: 16,
            },
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmitWithValidation}
        >
          <Form.Item
            label="Service Name"
            name="serviceName"
            rules={[{ required: true, message: "Please enter Service Name!" }]}
          >
            <Input placeholder="Enter Service name" className="h-12" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter Price!" }]}
          >
            <Input placeholder="Enter price" className="h-12" />
          </Form.Item>

          <Form.Item label="Upload Image">
            {uploadedImage ? (
              <div className="relative">
                <img src={uploadedImage} alt="Uploaded" width={100} />
                <CloseCircleOutlined
                  className="absolute top-0 right-0 text-red-500 cursor-pointer"
                  onClick={() => setUploadedImage(null)}
                />
              </div>
            ) : (
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                onChange={handleImageUpload}
              >
                <button style={{ border: 0, background: "none" }}>
                  <CloudUploadOutlined style={{ fontSize: 24 }} />
                  <div>Upload</div>
                </button>
              </Upload>
            )}
          </Form.Item>

          <div className="flex justify-end">
            <ButtonEDU actionType="save" />
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
}

export default EditSpecServiceModal;
