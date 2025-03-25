import React, { useState } from "react";
import { Table, Avatar, ConfigProvider, Input, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import PopOver from "../../../components/common/PopOver";
import man from "../../../assets/man.png";
import PendingProductsModal from "./PendingProductsModal";
function PendingProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const filteredData = userData.filter(
    (user) =>
      user.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber.includes(searchQuery) ||
      // user.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.spent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setSelectedProvider(record); // Store selected provider's data
    setIsModalOpen(true); // Open modal
  };

  // Handle ban functionality
  const handleBan = (provider) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === provider.key ? { ...user, banned: !user.banned } : user
      )
    );
    alert(
      `${provider.traineeName} has been ${
        provider.banned ? "unbanned" : "banned"
      }`
    );
  };

  // Handle saving edited provider
  const handleSave = (updatedProvider) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === updatedProvider.key ? updatedProvider : user
      )
    );
    setIsModalOpen(false);
  };

  const handleDeleteSelected = () => {
    setUserData(userData.filter((user) => !selectedRowKeys.includes(user.key)));
    setSelectedRowKeys([]);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
            cellFontSize: "16px",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
          },
          Button: {
            defaultHoverBg: "#fd7d00 ",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#fd7d00 ",
          },
          Input: {
            hoverBorderColor: "#fd7d00",
            activeBorderColor: "#fd7d00",
          },
        },
      }}
    >
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search by Name, Email or Phone"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="h-9 gap-2"
            allowClear
          />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteSelected}
              className="bg-abbes/90 hover:bg-abbes text-white border-none h-9"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns(handleEdit, handleBan)} // Pass handleEdit and handleBan to columns
        dataSource={filteredData}
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          total: 50,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      {/* Edit Modal */}
      <PendingProductsModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onSave={handleSave}
      />
    </ConfigProvider>
  );
}

export default PendingProducts;

const columns = (handleEdit, handleBan) => [
  {
    title: "Name",
    dataIndex: "traineeName",
    key: "traineeName",
  },
  {
    title: "Image",
    dataIndex: "productImage",
    key: "productImage",
    render: (_, record) => <img src={man} width={60} alt="Product" />,
  },

  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Submitted By",
    dataIndex: "submittedBy",
    key: "submittedBy",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },

  {
    key: "action",
    render: (text, record) => (
      <PopOver
        onEdit={() => handleEdit(record)}
        onBan={() => handleBan(record)} // Pass the handleBan function
      />
    ),
  },
];

const data = [
  {
    key: 1,
    traineeName: "John Doe",
    email: "johndoe@gmail.com",

    phoneNumber: "1234567890",
    address: "10 Warehouse Road, Apapa, Lagos",
    spent: "5000",
    avatar: man,
    banned: false, // Add banned field
  },
  {
    key: 2,
    traineeName: "Jane Smith",
    email: "janesmith@gmail.com",

    phoneNumber: "1234567891",
    address: "15 Broad Street, Lagos",
    spent: "4500",
    avatar: man,
    banned: false, // Add banned field
  },
];
