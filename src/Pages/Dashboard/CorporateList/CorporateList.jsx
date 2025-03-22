import React, { useState, useEffect } from "react";
import { Table, Avatar, ConfigProvider, Input, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import PopOver from "../../../components/common/PopOver";
import CorporateEditModal from "./CorporateEditModal";
import corporateLogo from "../../../assets/corporateLogo.png";

function CorporateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [filteredData, setFilteredData] = useState(data);

  // Improved search function with explicit debug logging
  useEffect(() => {
    const filterData = () => {
      if (!searchQuery.trim()) {
        setFilteredData(userData);
        return;
      }

      const query = searchQuery.trim();

      const filtered = userData.filter((user) => {
        // Create an array of all searchable values
        const searchableValues = [
          user.corporateName,
          user.phoneNumber,
          user.address,
          user.jobPost.toString(), // Explicitly convert jobPost to string
        ];

        // Check if any value includes the search query (case insensitive)
        return searchableValues.some((value) =>
          value.toString().toLowerCase().includes(query.toLowerCase())
        );
      });

      // Debug logs (can be removed in production)
      console.log("Search Query:", query);
      console.log("Filtered Data:", filtered);
      console.log(
        "JobPost values:",
        userData.map((u) => u.jobPost)
      );

      setFilteredData(filtered);
    };

    filterData();
  }, [searchQuery, userData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleEdit = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  const handleBan = (provider) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === provider.key ? { ...user, banned: !user.banned } : user
      )
    );
    alert(
      `${provider.corporateName} has been ${
        provider.banned ? "unbanned" : "banned"
      }`
    );
  };

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
            placeholder="Search in all fields"
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
        columns={columns(handleEdit, handleBan)}
        dataSource={filteredData}
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <CorporateEditModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onSave={handleSave}
      />
    </ConfigProvider>
  );
}

// Columns definition remains the same
const columns = (handleEdit, handleBan) => [
  {
    title: "Name",
    dataIndex: "corporateName",
    key: "corporateName",
    render: (text, record) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          src={record.avatar}
          alt={text}
          shape="circle"
          size={40}
          className="border border-abbes"
        />
        <div className="flex flex-col">
          <span>{text}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (_, record) => <span>+{record.phoneNumber}</span>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Job Post",
    dataIndex: "jobPost",
    key: "jobPost",
  },
  {
    key: "action",
    render: (_, record) => (
      <PopOver
        onEdit={() => handleEdit(record)}
        onBan={() => handleBan(record)}
      />
    ),
  },
];

export default CorporateList;
// Sample Data with the exact structure you provided
const data = [
  {
    key: 1,
    corporateName: "Aspire Sports Academy",
    phoneNumber: "1234567890",
    address: "10 Warehouse Road, Apapa, Lagos",
    jobPost: 180,
    avatar: corporateLogo,
    banned: false,
  },
  {
    key: 2,
    corporateName: "Aspire Sports Academy",
    phoneNumber: "1234567891",
    address: "15 Broad Street, Lagos",
    jobPost: 155,
    avatar: corporateLogo,
    banned: false,
  },
  {
    key: 3,
    corporateName: "Aspire Sports Academy",
    phoneNumber: "1234567891",
    address: "15 Broad Street, Lagos",
    jobPost: 50,
    avatar: corporateLogo,
    banned: false,
  },
];
