import React, { useState, useEffect } from "react";
import {
  Table,
  Avatar,
  ConfigProvider,
  Input,
  Button,
  Tooltip,
  message,
} from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaRegEye } from "react-icons/fa";
import { LuCheck, LuX } from "react-icons/lu";
import man from "../../../assets/man.png";
import pdf from "../../../assets/pdf.png";
import GetPageName from "../../../components/common/GetPageName";
import CertificateModal from "./CertificateModal.jsx";
import { CgEye, CgUndo } from "react-icons/cg";
import {
  useApproveOrRejectMutation,
  useGetCertificatesQuery,
} from "../../../redux/apiSlices/certificateSlice.js";

function CertificateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [userData, setUserData] = useState([]);

  const {
    data: certificateData,
    isLoading,
    error,
    refetch,
  } = useGetCertificatesQuery({
    page,
    limit,
    // searchTerm: searchQuery,
  });

  console.log("CertificateData", certificateData?.data);

  const [approveOrReject, { isLoading: isUpdating }] =
    useApproveOrRejectMutation();

  // Transform certificate data to match table structure
  useEffect(() => {
    if (certificateData?.data) {
      const transformedData = certificateData.data.map(
        (certificate, index) => ({
          key: certificate._id || index,
          _id: certificate._id,
          certificateName: certificate.title || "N/A",
          certificateFile: certificate.certificateFile || "",
          createdAt: certificate.createdAt,
          verified: certificate.verified || false,
          verifiedByAdmin: certificate.verifiedByAdmin || "pending", // Add this field
          userId: {
            fullName: certificate.userId?.fullName || "N/A",
            email: certificate.userId?.email || "N/A",
            phone: certificate.userId?.phone || "N/A",
            image: certificate.userId?.image || man,
          },
          // Keep original data for reference
          originalData: certificate,
        })
      );
      setUserData(transformedData);
    }
  }, [certificateData]);

  // Search function with debouncing
  const handleSearch = (value) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when searching
  };

  // Filter data based on search query
  const filteredData = userData.filter((item) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.userId.fullName.toLowerCase().includes(searchLower) ||
      item.userId.email.toLowerCase().includes(searchLower) ||
      item.userId.phone.toLowerCase().includes(searchLower) ||
      item.certificateName.toLowerCase().includes(searchLower)
    );
  });

  // Row selection for delete
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Handle deleting selected rows
  const handleDeleteSelected = () => {
    // You'll need to implement delete API call here
    console.log("Deleting rows:", selectedRowKeys);
    setSelectedRowKeys([]);
    message.success("Selected items deleted");
  };

  // Handle edit functionality (modal opening)
  const handleEdit = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  // Handle approve functionality
  const handleApprove = async (record) => {
    try {
      const res = await approveOrReject({
        id: record._id,
        verifiedByAdmin: { verifiedByAdmin: "verified" },
      });

      if (res.data || !res.error) {
        message.success("Certificate approved successfully!");
        refetch(); // Refetch data to update the UI
      } else {
        message.error("Failed to approve certificate");
      }
    } catch (err) {
      console.error("Approve error:", err);
      message.error("Failed to approve certificate");
    }
  };

  // Handle reject functionality
  const handleReject = async (record) => {
    try {
      const res = await approveOrReject({
        id: record._id,
        verifiedByAdmin: { verifiedByAdmin: "rejected" },
      });

      if (res.data || !res.error) {
        message.success("Certificate rejected successfully!");
        refetch(); // Refetch data to update the UI
      } else {
        message.error("Failed to reject certificate");
      }
    } catch (err) {
      console.error("Reject error:", err);
      message.error("Failed to reject certificate");
    }
  };

  // Handle pagination change
  const handleTableChange = (pagination) => {
    setPage(pagination.current);
    setLimit(pagination.pageSize);
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
            defaultHoverBg: "#fd7d00",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#fd7d00",
          },
          Input: {
            hoverBorderColor: "#fd7d00",
            activeBorderColor: "#fd7d00",
          },
        },
      }}
    >
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">Coach {GetPageName()}</h1>
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
              className="bg-red-500/90 hover:bg-red-500 text-white border-none h-9"
            >
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns(handleEdit, handleApprove, handleReject, isUpdating)}
        dataSource={filteredData}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: limit,
          total: filteredData.length,
          position: ["bottomRight"],
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        onChange={handleTableChange}
        rowKey="_id"
      />

      {/* Pass modal props to CertificateModal */}
      <CertificateModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onSuccess={refetch} // Pass refetch to update data after modal actions
      />
    </ConfigProvider>
  );
}

export default CertificateList;

const columns = (handleEdit, handleApprove, handleReject, isUpdating) => [
  {
    title: "Coach Name",
    dataIndex: ["userId", "fullName"],
    key: "coachName",
    render: (text, record) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          src={record.userId?.image || man}
          alt={text}
          shape="circle"
          size={40}
          className="border border-abbes"
        />
        <div className="flex flex-col">
          <span>{record.userId?.fullName || "N/A"}</span>
          <span className="text-gray-500 text-sm">
            {record.userId?.email || "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Certificate Name",
    dataIndex: "certificateName",
    key: "certificateName",
    render: (text) => text || "N/A",
  },
  {
    title: "Document",
    dataIndex: "certificateFile",
    key: "document",
    render: (certificateFile, record) => (
      <div className="flex items-center gap-1.5">
        <img src={pdf} width={40} height={40} alt="Document" />
        <div className="flex flex-col">
          <span className="text-sm">Certificate File</span>
          <span className="text-xs text-gray-500">PDF</span>
        </div>
      </div>
    ),
  },
  {
    title: "Submission Date",
    dataIndex: "createdAt",
    key: "submissionDate",
    render: (date) => {
      if (!date) return "N/A";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    title: "Status",
    dataIndex: "verifiedByAdmin",
    key: "status",
    render: (status) => {
      if (status === "pending") {
        return <span className="text-yellow-500 font-medium">Pending</span>;
      } else if (status === "verified") {
        return <span className="text-green-500 font-medium">Verified</span>;
      } else if (status === "rejected") {
        return <span className="text-red-500 font-medium">Rejected</span>;
      }
      return <span className="text-gray-500">Pending</span>;
    },
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => {
      const isProcessed =
        record.verifiedByAdmin === "verified" ||
        record.verifiedByAdmin === "rejected";

      return (
        <div className="flex items-center gap-3">
          <Tooltip title="View">
            <CgEye
              size={25}
              className="hover:text-abbes cursor-pointer"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {!isProcessed && (
            <>
              <Tooltip title="Approve">
                <LuCheck
                  size={25}
                  className={`hover:text-green-500 cursor-pointer ${
                    isUpdating ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => !isUpdating && handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <LuX
                  size={25}
                  className={`hover:text-red-500 cursor-pointer ${
                    isUpdating ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() => !isUpdating && handleReject(record)}
                />
              </Tooltip>
            </>
          )}

          {isProcessed && (
            <span className="text-sm text-gray-500 italic">
              {record.verifiedByAdmin === "verified" ? "Approved" : "Rejected"}
            </span>
          )}
        </div>
      );
    },
  },
];
