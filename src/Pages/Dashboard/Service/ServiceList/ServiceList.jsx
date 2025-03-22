import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  message,
  Button,
  Popover,
  Form,
  Input,
} from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../../components/common/GetPageName";

// Import the modal components

import { HiDotsVertical } from "react-icons/hi";
import EditServiceModal from "./EditServiceModal";
import DeleteServiceModal from "./DeleteServiceModal";

function CategoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tableData, setTableData] = useState([
    { key: "1", name: "John Brown", serial: 1, sliderimg: "" },
    { key: "2", name: "Jim Green", serial: 2, sliderimg: "" },
    { key: "3", name: "Joe Black", serial: 3, sliderimg: "" },
    { key: "4", serial: 4, sliderimg: "", name: "Mountain Escape" },
    { key: "5", serial: 5, sliderimg: "", name: "Sunset Glow" },
    { key: "6", serial: 6, sliderimg: "", name: "City Lights" },
  ]);
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

  const handleFormSubmit = (values) => {
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    if (isEditing) {
      // Update existing row
      const updatedData = tableData.map((item) =>
        item.key === editingKey
          ? {
              ...item,
              name: values.name,
              sliderimg: uploadedImage || item.sliderimg, // Retain old image if no new one is uploaded
            }
          : item
      );
      setTableData(updatedData);
      message.success("Slider updated successfully!");
    } else {
      // Add new row
      setTableData([
        ...tableData,
        {
          key: (tableData.length + 1).toString(),
          name: values.name,
          serial: tableData.length + 1,
          sliderimg: uploadedImage, // Ensure uploaded image is set
        },
      ]);
      message.success("Slider added successfully!");
    }

    handleCancel();
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    setUploadedImage(record.sliderimg);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (key, name) => {
    setDeletingRecord({ key, name });
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    setTableData(tableData.filter((item) => item.key !== deletingRecord.key));
    message.success("Slider deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const onCancelDelete = () => {
    message.info("Delete action canceled.");
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      key: "serial",
      render: (serial) => (
        <p className="font-bold text-black text-[16px]">
          {serial < 10 ? "0" + serial : serial}
        </p>
      ),
    },
    {
      title: "Slider Image",
      dataIndex: "sliderimg",
      key: "sliderimg",
      render: (sliderimg) => <img width={60} src={sliderimg} alt="slider" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popover
          content={
            <div className="flex items-center gap-2">
              <button
                className="bg-sky-400/50 hover:bg-sky-400 p-2 rounded-lg"
                type="link"
                onClick={() => handleEdit(record)}
              >
                <FiEdit2 size={15} />
              </button>
              <button
                className="bg-red-400/50 hover:bg-red-400 p-2 rounded-lg"
                type="link"
                onClick={() => handleDelete(record.key, record.name)}
              >
                <RiDeleteBin6Line size={15} />
              </button>
            </div>
          }
          trigger="click"
          placement="bottom"
        >
          <button>
            <HiDotsVertical />
          </button>
        </Popover>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by Name, Email or Phone"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            className="h-9"
            allowClear
          />
          <button
            className="bg-smart h-9 text-white px-4 py-2.5 rounded-md flex items-center"
            onClick={showModal}
          >
            <PlusOutlined className="mr-2" size={5} />
            <h1 className="text-[16px]"> Add New</h1>
          </button>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowSelectedBg: "#f6f6f6",
              headerBg: "#f6f6f6",
              headerSplitColor: "none",
              headerBorderRadius: "none",
            },
            Pagination: {
              borderRadius: "3px",
              itemActiveBg: "#18a0fb",
            },
            Button: {
              defaultHoverBg: "#18a0fb ",
              defaultHoverColor: "white",
              defaultHoverBorderColor: "#18a0fb ",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            defaultPageSize: 5,
            position: ["bottomRight"],
            size: "default",
            total: 50,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>

      {/* Modal components */}
      <EditServiceModal
        isEditing={isEditing}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        form={form}
        handleFormSubmit={handleFormSubmit}
        handleCancel={handleCancel}
        handleImageUpload={handleImageUpload}
      />

      <DeleteServiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        deletingRecord={deletingRecord}
        onCancelDelete={onCancelDelete}
        onConfirmDelete={onConfirmDelete}
      />
    </div>
  );
}

export default CategoryList;
