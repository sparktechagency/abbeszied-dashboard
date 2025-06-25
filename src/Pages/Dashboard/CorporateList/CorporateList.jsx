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

import { HiBan } from "react-icons/hi";
import { GrStatusGood } from "react-icons/gr";
import { getImageUrl } from "../../../utils/baseUrl";
import CorporateEditModal from "./CorporateEditModal";
import {
  useGetUserByRoleQuery,
  useUpdateUserMutation,
} from "../../../redux/apiSlices/userManagement";

function CorporateList() {
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
    refetch,
  } = useGetUserByRoleQuery({
    role: "corporate",
    page,
    limit,
    searchTerm: searchQuery,
  });

  const [banUser, { isLoading: isBanLoading }] = useUpdateUserMutation();

  // Transform API data to match table structure
  useEffect(() => {
    if (coachData?.data) {
      const transformedData = coachData.data.map((client, index) => ({
        key: client._id || index,
        corporateName: client.fullName || "N/A",
        email: client.email || "N/A",
        phoneNumber: client.phone || "N/A",
        address: client.address || "N/A",
        spent: "0",
        avatar: client.image || man,
        banned: !client.isActive,
        createdAt: client.createdAt,
      }));
      setUserData(transformedData);
    }
  }, [coachData]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1);
  };

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

  // Handle ban functionality
  const handleBan = async (record) => {
    try {
      console.log("Record data:", record); // Debug log to see what's being passed

      // Determine new status based on current banned state
      const newStatus = record?.banned ? "active" : "blocked";

      // Prepare the payload - ensure the ID field matches what your API expects
      const payload = {
        id: record?.key, // or record?._id if that's what your API expects
        status: newStatus,
      };

      console.log("Payload being sent:", payload); // Debug log for payload

      const res = await banUser(payload).unwrap();

      if (res.success) {
        message.success(
          `Corporate has been ${
            newStatus === "blocked" ? "blocked" : "activated"
          } successfully`
        );
      }

      // Refetch data to get updated state from server
      refetch();
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
      <CorporateEditModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onSave={handleSave}
      />
    </ConfigProvider>
  );
}

export default CorporateList;

// Updated columns definition with additional information
const columns = (handleEdit, handleBan, isBanLoading) => [
  {
    title: "Name",
    dataIndex: "corporateName",
    key: "corporateName",
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
    title: "Job Post",
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
        {banned ? (
          <div className="flex items-center gap-2">
            <HiBan size={20} className="text-red-600" />
            <span className="text-red-600 text-sm">Blocked</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <GrStatusGood size={20} className="text-green-600" />
            <span className="text-green-600 text-sm">Active</span>
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
      />
    ),
  },
];
