import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  Form,
  Upload,
  message,
  Button,
} from "antd";
import {
  PlusOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import man from "../../../assets/man.png";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";

function Slider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tableData, setTableData] = useState(
    Array.from({ length: 4 }, (_, i) => ({
      key: `${i + 1}`,
      serial: i + 1,
      sliderimg: man,
    }))
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedImage(null);
    setEditingKey(null);
  };

  const handleFormSubmit = () => {
    if (!uploadedImage && !isEditing)
      return message.error("Please upload an image!");

    setTableData((prev) =>
      isEditing
        ? prev.map((item) =>
            item.key === editingKey
              ? { ...item, sliderimg: uploadedImage || item.sliderimg }
              : item
          )
        : [
            ...prev,
            {
              key: `${prev.length + 1}`,
              serial: prev.length + 1,
              sliderimg: uploadedImage,
            },
          ]
    );

    message.success(`Slider ${isEditing ? "updated" : "added"} successfully!`);
    handleCancel();
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file || !file.type.startsWith("image/"))
      return message.error("You can only upload image files!");

    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    setUploadedImage(record.sliderimg);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setDeletingRecord(tableData.find((item) => item.key === key));
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    setTableData((prev) =>
      prev.filter((item) => item.key !== deletingRecord.key)
    );
    message.success("Slider deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      render: (serial) => (
        <p className="font-bold text-black text-[16px]">
          {serial.toString().padStart(2, "0")}
        </p>
      ),
    },
    {
      title: "Slider Image",
      dataIndex: "sliderimg",
      render: (sliderimg) => <img width={60} src={sliderimg} alt="slider" />,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <FiEdit2
            className="text-black hover:text-blue-500 cursor-pointer text-xl"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            className="text-black hover:text-red-500 cursor-pointer text-xl"
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            cellFontSize: "16px",
          },
        },
      }}
    >
      <div>
        <div className="flex justify-between items-center py-5">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <Button
            icon={<PlusOutlined />}
            className="bg-abbes h-9 text-white px-4 rounded-md"
            onClick={showModal}
          >
            Add New
          </Button>
        </div>
        <Table columns={columns} dataSource={tableData} />

        <Modal
          title="Delete Confirmation"
          open={isDeleteModalOpen}
          onCancel={() => setIsDeleteModalOpen(false)}
          footer={null}
          centered
        >
          <div className="text-center">
            Are you sure you want to delete{" "}
            <span className="font-bold">{deletingRecord?.name}</span>?
            <div className="flex justify-center gap-4 mt-4">
              <ButtonEDU
                actionType="cancel"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="delete" onClick={onConfirmDelete}>
                Delete
              </ButtonEDU>
            </div>
          </div>
        </Modal>

        <Modal
          title={isEditing ? "Edit Slider" : "Add Slider"}
          open={isModalOpen}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
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
                    <CloudUploadOutlined className="text-xl" />
                    <div>Upload</div>
                  </button>
                </Upload>
              )}
            </Form.Item>
            <div className="flex justify-end">
              <ButtonEDU actionType="save">Save</ButtonEDU>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default Slider;
