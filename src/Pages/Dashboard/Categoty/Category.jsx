import React, { useState, useEffect } from "react";
import { Table, ConfigProvider, Modal, message, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import CategoryModal from "./CategoryModal";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  useCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../redux/apiSlices/categorySlice";
import { getImageUrl } from "../../../utils/baseUrl";

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // API hooks
  const {
    data: categoryData,
    isLoading,
    isError,
    refetch,
  } = useCategoryQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Transform API data for table
  const tableData =
    categoryData?.data?.map((item, index) => ({
      key: item._id,
      id: item._id,
      name: item.name,
      serial: index + 1,
      icon: item.image
        ? `${getImageUrl}${
            item.image
          }`
        : null,
      type: item.type,
      count: item.count,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) || [];

  const showModal = () => {
    setIsEditing(false);
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Create FormData for file upload
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type || "client"); // Default type

      // Handle image upload
      if (formData.icon) {
        if (
          typeof formData.icon === "string" &&
          formData.icon.startsWith("data:")
        ) {
          // Convert base64 to file for new uploads
          const response = await fetch(formData.icon);
          const blob = await response.blob();
          const file = new File([blob], "category-image.png", {
            type: blob.type,
          });
          data.append("image", file);
        } else if (formData.icon instanceof File) {
          data.append("image", formData.icon);
        }
      }

      if (isEditing && editingData) {
        // Update existing category
        await updateCategory({
          id: editingData.id,
          updatedData: data,
        }).unwrap();
        message.success("Category updated successfully!");
      } else {
        // Create new category
        await createCategory(data).unwrap();
        message.success("Category added successfully!");
      }

      setIsModalOpen(false);
      setEditingData(null);
      refetch(); // Refresh data
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        error?.data?.message || "An error occurred while saving the category"
      );
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteCategory(deletingRecord.id).unwrap();
      message.success("Category deleted successfully!");
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
      refetch(); // Refresh data
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error(
        error?.data?.message || "An error occurred while deleting the category"
      );
    }
  };

  const onCancelDelete = () => {
    message.info("Delete action canceled.");
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
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
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (
        <div className="w-[60px] h-[60px] flex items-center justify-center">
          {icon ? (
            <img
              width={60}
              height={60}
              src={icon}
              alt="Category Icon"
              className="object-cover rounded"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-[60px] h-[60px] bg-gray-200 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <span className="font-medium text-gray-800">{name}</span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <span className="capitalize px-2 py-1 bg-gray-100 rounded text-sm">
          {type}
        </span>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      render: (count) => <span className="text-gray-600">{count || 0}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <FiEdit2
            style={{ fontSize: 24 }}
            className="text-black hover:text-blue-500 cursor-pointer transition-colors"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            style={{ fontSize: 24 }}
            className="text-black hover:text-red-500 cursor-pointer transition-colors"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">
          Error loading categories. Please try again.
        </div>
      </div>
    );
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
            defaultHoverBg: "fd7d00",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "fd7d00",
            defaultActiveBg: "fd7d00",
            defaultActiveColor: "white",
            defaultActiveBorderColor: "fd7d00",
          },
        },
      }}
    >
      <div>
        <div className="flex justify-between items-center py-5">
          <h1 className="text-[20px] font-medium">Category List</h1>
          <Button
            className="bg-abbes/90 text-white px-4 py-2.5 h-9 rounded-md flex items-center"
            onClick={showModal}
            loading={isCreating}
          >
            <PlusOutlined className="mr-2" />
            Add New
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={{
            defaultPageSize: 5,
            position: ["bottomRight"],
            size: "default",
            showSizeChanger: true,
            showQuickJumper: true,
            total: tableData.length,
          }}
          scroll={{ x: 800 }}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Confirmation"
          open={isDeleteModalOpen}
          onCancel={onCancelDelete}
          footer={null}
          centered
        >
          <div className="flex flex-col justify-between gap-5">
            <div className="flex justify-center text-center">
              Are you sure you want to delete{" "}
              <span className="font-bold ml-1">"{deletingRecord?.name}"</span>?
            </div>
            <div className="flex justify-center gap-4">
              <ButtonEDU
                actionType="cancel"
                onClick={onCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </ButtonEDU>
              <ButtonEDU
                actionType="delete"
                onClick={onConfirmDelete}
                loading={isDeleting}
              >
                Delete
              </ButtonEDU>
            </div>
          </div>
        </Modal>

        {/* Add/Edit Category Modal */}
        <CategoryModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          onSubmit={handleFormSubmit}
          isEditing={isEditing}
          editingData={editingData}
          isLoading={isCreating || isUpdating}
        />
      </div>
    </ConfigProvider>
  );
}

export default Category;
