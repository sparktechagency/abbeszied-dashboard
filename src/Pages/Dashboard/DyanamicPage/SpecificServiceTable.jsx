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
import { HiDotsVertical } from "react-icons/hi";
import cleaning from "../../../assets/cleaning.png";
import { IoEye } from "react-icons/io5";
import { Link } from "react-router-dom";
import DeleteServiceModal from "../Service/ServiceList/DeleteServiceModal";
import EditSpecServiceModal from "./EditSpecServiceModal";
import GetPageName from "../../../components/common/GetPageName";

function SpecificServiceTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tableData, setTableData] = useState([
    {
      key: "1",
      serviceName: "Car Cleaning",
      serial: 1,
      icon: cleaning,
      totalService: "20",
      price: "$100 - $200",
    },
    {
      key: "2",
      serviceName: "Pool Cleaning",
      serial: 2,
      icon: cleaning,
      totalService: "15",
      price: "$50 - $150",
    },
    {
      key: "3",
      serviceName: "Garden Cleaning",
      serial: 3,
      icon: cleaning,
      totalService: "30",
      price: "$200 - $300",
    },
    {
      key: "4",
      serviceName: "House Cleaning",
      serial: 4,
      icon: cleaning,
      totalService: "25",
      price: "$150 - $250",
    },
    {
      key: "5",
      serviceName: "Kitchen Cleaning",
      serial: 5,
      icon: cleaning,
      price: "$80 - $180",
    },
  ]);
  const [filteredData, setFilteredData] = useState(tableData);
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
      const updatedData = tableData.map((item) =>
        item.key === editingKey
          ? {
              ...item,
              serviceName: values.serviceName,
              icon: uploadedImage || item.icon,
              price: values.price,
            }
          : item
      );
      setTableData(updatedData);
      setFilteredData(updatedData);
      message.success("Service updated successfully!");
    } else {
      setTableData([
        ...tableData,
        {
          key: (tableData.length + 1).toString(),
          serviceName: values.serviceName,
          serial: tableData.length + 1,
          icon: uploadedImage,
          price: values.price,
        },
      ]);
      setFilteredData([
        ...filteredData,
        {
          key: (tableData.length + 1).toString(),
          serviceName: values.serviceName,
          serial: tableData.length + 1,
          icon: uploadedImage,
          price: values.price,
        },
      ]);
      message.success("Service added successfully!");
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
    setUploadedImage(record.icon);
    form.setFieldsValue({
      serviceName: record.serviceName,
      price: record.price,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setDeletingRecord(key);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    const newData = tableData.filter((item) => item.key !== deletingRecord);
    setTableData(newData);
    setFilteredData(newData);
    message.success("Service deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const onCancelDelete = () => {
    message.info("Delete action canceled.");
    setIsDeleteModalOpen(false);
  };

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    const filtered = tableData.filter(
      (item) =>
        item.serviceName.toLowerCase().includes(lowercasedValue) ||
        item.price.toLowerCase().includes(lowercasedValue)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      key: "serial",
      render: (serial) => <p className="font-bold">{serial}</p>,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => <img width={60} src={icon} alt="service" />,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-2">
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
                  onClick={() => handleDelete(record.key)}
                >
                  <RiDeleteBin6Line size={15} />
                </button>
              </div>
            }
            trigger="click"
            placement="bottom"
          >
            <button>
              <HiDotsVertical size={20} />
            </button>
          </Popover>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by Category, Total Service, or Price Range"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            className="h-9 gap-1.5"
          />
          <button
            className="bg-smart h-9 text-white px-4 py-2.5 rounded-md flex items-center"
            onClick={showModal}
          >
            <PlusOutlined className="mr-2" size={5} />
            <h1 className="text-[16px]">Add New</h1>
          </button>
        </div>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Table: {
              rowSelectedBg: "#f6f6f6",
              headerBg: "#f6f6f6",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{
            defaultPageSize: 5,
            position: ["bottomRight"],
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </ConfigProvider>

      <EditSpecServiceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        uploadedImage={uploadedImage}
        setUploadedImage={setUploadedImage}
        form={form}
        handleFormSubmit={handleFormSubmit}
        handleCancel={handleCancel}
        handleImageUpload={handleImageUpload}
        isEditing={isEditing}
      />
      <DeleteServiceModal
        isDeleteModalOpen={isDeleteModalOpen}
        deletingRecord={deletingRecord}
        onConfirmDelete={onConfirmDelete}
        onCancelDelete={onCancelDelete}
      />
    </div>
  );
}

export default SpecificServiceTable;
