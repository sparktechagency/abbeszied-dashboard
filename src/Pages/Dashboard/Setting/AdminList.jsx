import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import {
  Flex,
  Input,
  Table,
  Popover,
  Modal,
  ConfigProvider,
  message,
  Spin,
  Tooltip,
} from "antd";
import { MoreOutlined } from "@ant-design/icons";

import ButtonEDU from "../../../components/common/ButtonEDU";
import { RiDeleteBin6Line } from "react-icons/ri";
import AdminModal from "./AdminModal";
import {
  useCreateAdminMutation,
  useGetAllAdminQuery,
  useDeleteAdminMutation,
} from "../../../redux/apiSlices/adminSlice";

const MAXIMUM_ADMIN_LIMIT = 5;

const AdminList = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Get all Admin Data
  const {
    data: adminListData,
    isLoading,
    isError,
    refetch,
  } = useGetAllAdminQuery();

  // Create a new Admin API
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();

  // Delete Admin API
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  // Transform API data to match table format
  const transformedData =
    adminListData?.data?.map((admin, index) => ({
      key: admin._id,
      _id: admin._id,
      name: admin.fullName,
      email: admin.email,
      role: admin.role,
      creationdate: new Date(admin.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      image: admin.image,
      phone: admin.phone,
    })) || [];

  // Check if maximum admin limit is reached
  const isMaxLimitReached = transformedData.length >= MAXIMUM_ADMIN_LIMIT;

  // Update filtered data when API data changes
  useEffect(() => {
    setFilteredData(transformedData);
  }, [adminListData]);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = transformedData.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // Add Admin Modal handlers
  const showAddModal = () => {
    if (isMaxLimitReached) {
      message.warning(`Maximum ${MAXIMUM_ADMIN_LIMIT} admins allowed!`);
      return;
    }
    setSelectedAdmin(null);
    setIsAddModalOpen(true);
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleAddAdmin = async (newAdmin) => {
    try {
      // Double check limit before creating
      if (transformedData.length >= MAXIMUM_ADMIN_LIMIT) {
        message.warning(`Maximum ${MAXIMUM_ADMIN_LIMIT} admins allowed!`);
        return;
      }

      // Prepare data for API
      const adminData = {
        fullName: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: "admin", // Always set to admin as per your requirement
      };

      const result = await createAdmin(adminData).unwrap();

      if (result.success) {
        message.success("Admin added successfully!");
        setIsAddModalOpen(false);
        setSelectedAdmin(null);
        refetch(); // Refresh the admin list
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      message.error(error?.data?.message || "Failed to add admin");
    }
  };

  // Delete Admin Modal handlers
  const showDeleteModal = (record) => {
    setSelectedAdmin(record);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      const result = await deleteAdmin(selectedAdmin._id).unwrap();

      if (result.success) {
        message.success("Admin deleted successfully!");
        setIsDeleteModalOpen(false);
        setSelectedAdmin(null);
        refetch(); // Refresh the admin list
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      message.error(error?.data?.message || "Failed to delete admin");
    }
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="w-[60%] bg-white rounded-lg shadow-lg p-5 flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[60%] bg-white rounded-lg shadow-lg p-5">
        <div className="text-center text-red-500 py-8">
          <p>Error loading admin data</p>
          <ButtonEDU actionType="add" onClick={refetch}>
            Retry
          </ButtonEDU>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[60%] bg-white rounded-lg shadow-lg p-5">
      <TableHead
        searchText={searchText}
        handleSearch={handleSearch}
        onAdd={showAddModal}
        isMaxLimitReached={isMaxLimitReached}
        currentCount={transformedData.length}
        maxLimit={MAXIMUM_ADMIN_LIMIT}
      />
      <TableBody filteredData={filteredData} onDelete={showDeleteModal} />

      {/* Add Admin Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onCancel={handleCancelAdd}
        onSubmit={handleAddAdmin}
        selectedAdmin={selectedAdmin}
        isEditMode={false}
        isLoading={isCreating}
      />

      {/* Delete Admin Modal */}
      <Modal
        title="Delete Admin"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        className="z-50"
      >
        <DeleteAdmin
          name={selectedAdmin?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isLoading={isDeleting}
        />
      </Modal>
    </div>
  );
};

const TableHead = ({
  searchText,
  handleSearch,
  onAdd,
  isMaxLimitReached,
  currentCount,
  maxLimit,
}) => {
  const addButton = (
    <ButtonEDU
      actionType="add"
      onClick={onAdd}
      disabled={isMaxLimitReached}
      className={isMaxLimitReached ? "opacity-50 cursor-not-allowed" : ""}
    >
      <div className="flex items-center justify-center gap-2">
        <FaPlus size={15} /> Add new
      </div>
    </ButtonEDU>
  );

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex flex-col gap-2">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                hoverBorderColor: "#fd7d00",
                activeBorderColor: "#fd7d00",
              },
            },
          }}
        >
          <Input
            placeholder="Search admins..."
            value={searchText}
            onChange={handleSearch}
            className="w-80 h-10"
            allowClear
          />
        </ConfigProvider>
        <div className="text-sm text-gray-600">
          Total Admins:{" "}
          <span className="font-semibold">
            {currentCount}/{maxLimit}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {isMaxLimitReached ? (
          <Tooltip
            title={`Maximum ${maxLimit} admins allowed. Delete an admin to add a new one.`}
          >
            {addButton}
          </Tooltip>
        ) : (
          addButton
        )}
        {isMaxLimitReached && (
          <div className="text-xs text-red-500">Maximum limit reached</div>
        )}
      </div>
    </div>
  );
};

const TableBody = ({ filteredData, onDelete }) => (
  <Table
    rowKey={(record) => record.key}
    columns={columns(onDelete)}
    dataSource={filteredData}
    className="mt-5"
    pagination={false}
  />
);

const DeleteAdmin = ({ name, onConfirm, onCancel, isLoading }) => (
  <Flex
    vertical
    justify="space-between"
    className="w-full h-full mb-3 mt-3"
    gap={20}
  >
    <Flex align="center" justify="center">
      Are you sure you want to delete{" "}
      <span className="font-bold ml-1">{name}</span>?
    </Flex>
    <div className="flex items-center justify-center gap-4">
      <ButtonEDU actionType="cancel" onClick={onCancel} disabled={isLoading}>
        Cancel
      </ButtonEDU>
      <ButtonEDU actionType="delete" onClick={onConfirm} loading={isLoading}>
        Delete
      </ButtonEDU>
    </div>
  </Flex>
);

const columns = (onDelete) => [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (role) => (
      <span className="capitalize px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        {role}
      </span>
    ),
  },
  {
    title: "Creation Date",
    dataIndex: "creationdate",
    key: "creationdate",
    sorter: (a, b) => new Date(a.creationdate) - new Date(b.creationdate),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onDelete(record)}
          className="bg-gray-400/50 hover:bg-abbes  p-2 rounded-lg transition-colors"
        >
          <RiDeleteBin6Line size={15} />
        </button>
      </div>
    ),
  },
];

export default AdminList;
