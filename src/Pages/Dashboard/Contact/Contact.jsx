import React, { useState } from "react";
import { Modal, Form, Input, Button, Flex } from "antd";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { PiMapPinAreaLight } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import ButtonEDU from "../../../components/common/ButtonEDU";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "(+62) 8896-2220 | (021) 111 444 90",
    email: "demo@gmail.com",
    location: "Jl. Merdeka Raya No.73B, Kuta, Badung, Bali",
  });
  const [form] = Form.useForm();
  const [editedContact, setEditedContact] = useState({ ...contactInfo });

  const showModal = () => {
    // Reset edited contact to current contact info when opening modal
    setEditedContact({ ...contactInfo });
    form.setFieldsValue(contactInfo); // Set form values to current contact info
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        // Trim everything after the domain part (e.g., ".com", ".org")
        const trimmedEmail = values.email.replace(
          /(\.com|\.org|\.net|\.edu)(.*)$/,
          "$1"
        );

        // Update the contact info with the form values and trimmed email
        const updatedContact = {
          ...values,
          email: trimmedEmail,
        };

        // Update the main contact info
        setContactInfo(updatedContact);

        // Close the modal
        setIsModalOpen(false);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const handleCancel = () => {
    // Reset form fields
    form.resetFields();

    // Close the modal without updating contact info
    setIsModalOpen(false);
  };

  const contactFields = [
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "location", label: "Location", type: "text" },
  ];

  return (
    <div className="py-5">
      <h1 className="text-[20px] font-medium mb-5">Contact</h1>
      <Flex vertical justify="center" gap={30} className="w-full">
        <div className="flex items-center justify-normal bg-white p-12 w-4/5 gap-4 rounded-xl ">
          {[
            {
              icon: <LiaPhoneVolumeSolid size={50} />,
              title: "Phone",
              details: contactInfo.phone,
            },
            {
              icon: <CiMail size={50} />,
              title: "Email",
              details: contactInfo.email,
            },
            {
              icon: <PiMapPinAreaLight size={50} />,
              title: "Location",
              details: contactInfo.location,
            },
          ].map((item, index) => (
            <Flex
              vertical
              key={index}
              gap={20}
              align="center"
              className="flex-auto"
            >
              <div className="bg-white rounded-xl shadow-[0px_0px_15px_4px_rgba(0,_0,_0,_0.1)] p-4 hover:bg-abbes text-abbes hover:text-white">
                {item.icon}
              </div>
              <div className="flex flex-col items-center">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.details}</p>
              </div>
            </Flex>
          ))}
        </div>
        <button
          onClick={showModal}
          className="w-4/5 h-12 bg-white rounded-lg border border-1 border-abbes text-abbes font-bold tracking-wider hover:bg-abbes hover:text-white hover:transition-all duration-500"
        >
          Edit Info
        </button>
      </Flex>

      {/* Edit Contact Modal */}
      <Modal
        title="Edit Contact"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={false}
        centered
      >
        <div className="py-5">
          <Form form={form} layout="vertical" initialValues={contactInfo}>
            {contactFields.map((field, i) => (
              <Form.Item
                key={i}
                label={field.label}
                name={field.key}
                rules={[
                  {
                    required: true,
                    message: `Please enter the ${field.label.toLowerCase()}`,
                  },
                  field.key === "email" && {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message:
                      "Please enter a valid email address (e.g. test@example.com)",
                  },
                ].filter(Boolean)}
              >
                <Input
                  type={field.type}
                  placeholder={`Enter your ${field.label.toLowerCase()}`}
                  className="h-12 rounded-xl"
                />
              </Form.Item>
            ))}

            <div className="flex justify-end gap-4">
              <ButtonEDU
                actionType="cancel"
                onClick={handleCancel}
                htmlType="button"
              >
                Cancel
              </ButtonEDU>
              <ButtonEDU
                actionType="update"
                onClick={handleUpdate}
                htmlType="button"
              >
                Update
              </ButtonEDU>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Contact;
