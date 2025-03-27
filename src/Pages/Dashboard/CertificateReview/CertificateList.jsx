import React, { useState } from "react";
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
import CertificateModal from "./CertificateModal.jsx"; // Import your modal
import { CgEye, CgUndo } from "react-icons/cg";

function CertificateList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [userData, setUserData] = useState(data); // Initial data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Search function
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Filter data based on the search query
  const filteredData = userData.filter(
    (user) =>
      user.coachName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phoneNumber?.includes(searchQuery) ||
      user.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.spent?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Row selection for delete
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Handle deleting selected rows
  const handleDeleteSelected = () => {
    setUserData(userData.filter((user) => !selectedRowKeys.includes(user.key)));
    setSelectedRowKeys([]); // Clear selected rows after deletion
  };

  // Handle edit functionality (modal opening)
  const handleEdit = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  // Handle approve functionality (toggle on click)
  const handleApprove = (key) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === key
          ? { ...user, approved: !user.approved, rejected: false } // Toggle approve, reset reject
          : user
      )
    );
    message.success("Status updated");
  };

  // Handle reject functionality (toggle on click)
  const handleReject = (key) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === key
          ? { ...user, rejected: !user.rejected, approved: false } // Toggle reject, reset approve
          : user
      )
    );
    message.success("Status updated");
  };

  // Handle reset functionality
  const handleReset = (key) => {
    setUserData((prevData) =>
      prevData.map((user) =>
        user.key === key ? { ...user, approved: false, rejected: false } : user
      )
    );
    message.info("Status reset");
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
        <h1 className="text-[20px] font-medium">Coach {GetPageName()}</h1>
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
        columns={columns(handleEdit, handleApprove, handleReject, handleReset)} // Pass functions
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

      {/* Pass modal props to CertificateModal */}
      <CertificateModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
      />
    </ConfigProvider>
  );
}

export default CertificateList;

const columns = (handleEdit, handleApprove, handleReject, handleReset) => [
  {
    title: "Coach Name",
    dataIndex: "coachName",
    key: "coachName",
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
          <span>{record.email}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Certificate Name",
    dataIndex: "certificateName",
    key: "certificateName",
  },
  {
    title: "Document",
    dataIndex: "document",
    key: "document",
    render: (_, record) => (
      <div className="flex items-center gap-1.5">
        <img src={pdf} width={40} height={40} alt="Document" />
        <div className="flex flex-col">
          <span>{record.document.fileName}</span>
          <span>{record.document.size}</span>
        </div>
      </div>
    ),
  },
  {
    title: "Submission Date",
    dataIndex: "submissionDate",
    key: "submissionDate",
  },

  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <div className="flex items-center gap-3">
        <Tooltip title="View">
          <CgEye
            size={25}
            className="hover:text-abbes cursor-pointer"
            onClick={() => handleEdit(record)}
          />
        </Tooltip>
        <Tooltip title="Approve">
          <LuCheck
            size={25}
            className={`hover:text-green-500 cursor-pointer ${
              record.approved ? "text-green-500 scale-105" : ""
            }`}
            onClick={() => handleApprove(record.key)}
          />
        </Tooltip>
        <Tooltip title="Reject">
          <LuX
            size={25}
            className={`hover:text-red-500 cursor-pointer ${
              record.rejected ? "text-red-500 scale-105" : ""
            }`}
            onClick={() => handleReject(record.key)}
          />
        </Tooltip>
        <Tooltip title="Reset">
          <CgUndo
            size={28}
            onClick={() => handleReset(record.key)}
            className="hover:text-sky-600"
          />
        </Tooltip>
      </div>
    ),
  },
];

// Sample data
const data = [
  {
    key: 1,
    coachName: "John Doe",
    email: "johndoe@gmail.com",
    certificateName: "Fitness Coach",
    document: { fileName: "file.pdf", size: "2MB" },
    submissionDate: "12 Mar 2025",
    avatar: man,
    approved: false,
    rejected: false,
  },
  {
    key: 2,
    coachName: "Jane Smith",
    email: "janesmith@gmail.com",
    certificateName: "Football Coach",
    document: { fileName: "file.pdf", size: "2MB" },
    submissionDate: "12 May 2025",
    avatar: man,
    approved: false,
    rejected: false,
  },
];
