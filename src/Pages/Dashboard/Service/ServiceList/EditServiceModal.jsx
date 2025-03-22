import React from "react";
import { Modal, Form, Input, Upload, ConfigProvider, message } from "antd";
import { CloseCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../../components/common/ButtonEDU";

function EditServiceModal({
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
  return (
    <Modal
      title={isEditing ? "Edit Category" : "Add Category"}
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
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input placeholder="Enter slider name" className="h-12" />
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

export default EditServiceModal;
