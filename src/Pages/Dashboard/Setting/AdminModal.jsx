import React, { useRef, useEffect } from "react";
import { Modal, Form, Input, ConfigProvider, message } from "antd";
import ButtonEDU from "../../../components/common/ButtonEDU";

const AdminModal = ({
  isOpen,
  onCancel,
  onSubmit,
  selectedAdmin,
  isEditMode = false,
  isLoading = false,
}) => {
  const formRef = useRef(null);

  useEffect(() => {
    if (isOpen && isEditMode && selectedAdmin) {
      setTimeout(() => {
        formRef.current?.setFieldsValue(selectedAdmin);
      }, 0);
    } else if (isOpen && !isEditMode) {
      // For add mode, reset fields and set default role
      setTimeout(() => {
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue({ role: "Admin" });
      }, 0);
    }
  }, [isOpen, isEditMode, selectedAdmin]);

  const handleCancel = () => {
    onCancel();
    formRef.current?.resetFields();
    if (!isLoading) {
      message.info(`Admin ${isEditMode ? "edit" : "addition"} cancelled.`);
    }
  };

  const handleSubmit = async (values) => {
    try {
      // Clean email to ensure it ends with .com
      const cleanEmail = values.email.replace(/\.com.*/i, ".com");

      if (isEditMode) {
        // Edit mode (currently not implemented as per your request)
        const updatedAdmin = {
          ...selectedAdmin,
          ...values,
          email: cleanEmail,
        };
        await onSubmit(updatedAdmin);
      } else {
        // Add mode
        const newAdmin = {
          name: values.name,
          email: cleanEmail,
          password: values.password,
          role: "Admin", // Always Admin for new admins
        };
        await onSubmit(newAdmin);
        formRef.current?.resetFields();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const modalTitle = isEditMode ? "Edit Admin" : "Add Admin";
  const submitButtonText = isEditMode ? "Update" : "Save";

  return (
    <Modal
      title={modalTitle}
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      className="z-50"
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
          },
        }}
      >
        <Form
          layout="vertical"
          ref={formRef}
          onFinish={handleSubmit}
          disabled={isLoading}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter Name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 50, message: "Name cannot exceed 50 characters" },
            ]}
          >
            <Input placeholder="Enter full name" className="h-10" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter Email" },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
              },
              {
                validator: (_, value) => {
                  // Ensure no characters after .com
                  if (value && value.includes(".com")) {
                    const emailAfterDot = value.split(".com")[1];
                    if (emailAfterDot && emailAfterDot.length > 0) {
                      return Promise.reject(
                        "No characters should be after .com"
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Enter email address" className="h-10" />
          </Form.Item>

          {/* Role field - always disabled and set to Admin */}
          <Form.Item label="Role" name="role" initialValue="Admin">
            <Input placeholder="Admin" className="h-10" disabled />
          </Form.Item>

          {/* Password field - only show for add mode */}
          {!isEditMode && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter Password" },
                { min: 6, message: "Password must be at least 6 characters" },
                { max: 20, message: "Password cannot exceed 20 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter password"
                className="h-10"
                autoComplete="new-password"
              />
            </Form.Item>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <ButtonEDU
              actionType="cancel"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </ButtonEDU>
            <ButtonEDU
              actionType="save"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {submitButtonText}
            </ButtonEDU>
          </div>
        </Form>
      </ConfigProvider>
    </Modal>
  );
};

export default AdminModal;
