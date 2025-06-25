import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  ConfigProvider,
  Input,
  Button,
  Pagination,
  message,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import PopOver from "../../../components/common/PopOver";

import man from "../../../assets/man.png";
import {
  useGetUserByRoleQuery,
  useUpdateUserMutation,
} from "../../../redux/apiSlices/userManagement";
import { HiBan } from "react-icons/hi";
import { GrStatusGood } from "react-icons/gr";
import { getImageUrl } from "../../../utils/baseUrl";
import ServiceEditModal from "./ServiceEditModal";

function CoachList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const {
    data: coachData,
    isLoading,
    error,
    refetch, // Added refetch to refresh data after status change
  } = useGetUserByRoleQuery({
    role: "coach",
    page,
    limit,
    searchTerm: searchQuery,
  });

  console.log("Coach", coachData?.data);

  const [banUser, { isLoading: isBanLoading }] = useUpdateUserMutation();

  // Transform API data to match table structure
  useEffect(() => {
    if (coachData?.data) {
      const transformedData = coachData.data.map((client, index) => ({
        key: client._id || index,
        _id: client._id, // Keep original ID for API calls
        traineeName: client.fullName || "N/A",
        email: client.email || "N/A",
        phoneNumber: client.phone || "N/A",
        address: client.address || "N/A",
        spent: "0", // You might need to calculate this from another API
        avatar: client.image || man,
        banned: client.status, // This should be 'active' or 'blocked'
        createdAt: client.createdAt,
      }));
      setUserData(transformedData);
    }
  }, [coachData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  // Remove client-side filtering since server handles search
  const displayData = userData;

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  // Handle ban functionality with proper toggle behavior
  const handleBan = async (record) => {
    try {
      console.log("Record data:", record);

      // Proper toggle logic: if current status is 'blocked', change to 'active', and vice versa
      const newStatus = record?.banned === "blocked" ? "active" : "blocked";

      // Use the original _id for API calls
      const payload = {
        id: record?._id || record?.key,
        status: newStatus,
      };

      console.log("Payload being sent:", payload);

      const res = await banUser(payload).unwrap();

      if (res.success) {
        message.success(
          `Coach has been ${
            newStatus === "blocked" ? "blocked" : "activated"
          } successfully`
        );

        // Refetch data to get updated state from server
        refetch();
      }
    } catch (err) {
      console.error("Ban/Unban error:", err);
      message.error(err?.data?.message || "Failed to update user status");
    }
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

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

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
            value={searchQuery}
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

      <div className="max-h-[75vh] overflow-auto border rounded-md">
        <Table
          rowSelection={rowSelection}
          columns={columns(handleEdit, handleBan, isBanLoading)}
          dataSource={displayData}
          pagination={false}
          loading={isLoading}
        />
      </div>

      <Pagination
        current={page}
        pageSize={limit}
        total={coachData?.meta?.total || 0}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        size="small"
        align="end"
        showSizeChanger={true}
        showQuickJumper={true}
        pageSizeOptions={["10", "20", "50"]}
        onChange={(newPage, newPageSize) => {
          setPage(newPage);
          if (newPageSize !== limit) {
            setLimit(newPageSize);
          }
        }}
        onShowSizeChange={(current, size) => {
          setPage(1);
          setLimit(size);
        }}
        className="mt-2 text-right"
      />

      {/* Edit Modal */}
      <ServiceEditModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onSave={handleSave}
      />
    </ConfigProvider>
  );
}

export default CoachList;

// Updated columns definition with proper toggle behavior indication
const columns = (handleEdit, handleBan, isBanLoading) => [
  {
    title: "Name",
    dataIndex: "traineeName",
    key: "traineeName",
    render: (text, record) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          src={`${getImageUrl}${record.avatar}`}
          alt={text}
          shape="circle"
          size={40}
          className="border border-abbes"
        />
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          <span className="text-gray-500 text-sm">{record.email}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (phone) => <span>{phone !== "N/A" ? `+${phone}` : "N/A"}</span>,
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    render: (address) => <span className="text-sm">{address || "N/A"}</span>,
  },
  {
    title: "Earn",
    dataIndex: "spent",
    key: "spent",
    render: (spent) => <span>${spent}</span>,
  },
  {
    title: "Status",
    dataIndex: "banned",
    key: "banned",
    render: (banned, record) => (
      <div className="flex flex-col">
        {banned === "blocked" ? (
          <div className="flex items-center gap-2">
            <HiBan size={20} className="text-red-600" />
            <span className="text-red-600 text-sm font-medium">Blocked</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <GrStatusGood size={20} className="text-green-600" />
            <span className="text-green-600 text-sm font-medium">Active</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "action",
    render: (text, record) => (
      <PopOver
        onEdit={() => handleEdit(record)}
        onBan={() => handleBan(record)}
        loading={isBanLoading}
        banText={record.banned === "blocked" ? "Activate" : "Block"} // Dynamic text for better UX
      />
    ),
  },
];
