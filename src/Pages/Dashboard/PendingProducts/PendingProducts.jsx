import { useState, useMemo } from "react";
import { Table, ConfigProvider, Input, Button, Tooltip, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
import { LuX, LuCheck } from "react-icons/lu";
import shoe from "../../../assets/shoe.png";
import PendingProductsModal from "./PendingProductsModal";

import { CgEye, CgUndo } from "react-icons/cg";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../../redux/apiSlices/productSlice";
import { imageUrl } from "../../../redux/api/baseApi";
import { getImageUrl } from "../../../utils/baseUrl";

function PendingProducts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // RTK Query will automatically re-render when data changes
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  // Transform API data to match table structure
  const transformedData = useMemo(() => {
    if (!productData?.data) return [];

    return productData.data.map((product, index) => ({
      key: product._id || index,
      productName: product.name || "N/A",
      category: product.category || "N/A",
      submittedBy: product.sellerId?.fullName || "Unknown Seller",
      price: `Qar ${product.price || 0}`,
      productImage: product.images?.[0]
        ? `${getImageUrl}${product?.images[0]}`
        : shoe,
      condition: product.condition || "N/A",
      description: product.description || "N/A",
      location: product.location || "N/A",
      status: product.status || "N/A",
      isApproved: product.isApproved || "pending",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      sellerId: product.sellerId?._id,
      sellerFullName: product.sellerId?.fullName,
      originalData: product,
    }));
  }, [productData?.data]);

  // Open the modal and set the selected product data
  const handleModalOpen = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const [approveProduct] = useUpdateProductMutation();

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return transformedData;

    return transformedData.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transformedData, searchQuery]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDeleteSelected = () => {
    console.log("Delete selected products:", selectedRowKeys);
    setSelectedRowKeys([]);
  };

  // Handle approve/reject actions
  const handleApprove = async (record) => {
    try {
      message.loading({ content: "Approving product...", key: "approve" });
      const result = await approveProduct({
        id: record.key,
        updatedData: { status: "approved" },
      }).unwrap();

      message.success({
        content: "Product approved successfully!",
        key: "approve",
      });

      // Optional: Force refetch if needed
      // refetch();

      console.log("Product approved successfully:", result);
    } catch (error) {
      message.error({
        content: "Failed to approve product. Please try again.",
        key: "approve",
      });
      console.error("Error approving product:", error);
    }
  };

  const handleReject = async (record) => {
    try {
      message.loading({ content: "Rejecting product...", key: "reject" });
      const result = await approveProduct({
        id: record.key,
        updatedData: { status: "rejected" },
      }).unwrap();

      message.success({
        content: "Product rejected successfully!",
        key: "reject",
      });

      // Optional: Force refetch if needed
      // refetch();

      console.log("Product rejected successfully:", result);
    } catch (error) {
      message.error({
        content: "Failed to reject product. Please try again.",
        key: "reject",
      });
      console.error("Error rejecting product:", error);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "15%",
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",
      width: "12%",
      render: (_, record) => (
        <img
          src={record.productImage}
          width={80}
          height={80}
          alt={record.productName}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          onError={(e) => {
            e.target.src = shoe;
          }}
        />
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "10%",
    },
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
      width: "15%",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: "10%",
    },
    {
      title: "Condition",
      dataIndex: "condition",
      key: "condition",
      width: "10%",
    },
    {
      title: "Status",
      dataIndex: "isApproved",
      key: "isApproved",
      width: "10%",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "approved"
              ? "bg-green-100 text-green-800"
              : status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status || "pending"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "18%",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="View Details">
            <CgEye
              size={20}
              className="hover:text-abbes cursor-pointer"
              onClick={() => handleModalOpen(record)}
            />
          </Tooltip>
          {record.isApproved === "approved" ? (
            <Tooltip title="Reject">
              <LuX
                size={20}
                className="hover:text-red-500 cursor-pointer"
                onClick={() => handleReject(record)}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Approve">
              <LuCheck
                size={20}
                className="hover:text-green-500 cursor-pointer"
                onClick={() => handleApprove(record)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading products...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">
          Error loading products. Please try again.
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
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Search products..."
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            className="h-9 gap-2"
            allowClear
          />
          {selectedRowKeys.length > 0 && (
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white border-none h-9"
            >
              Delete Selected ({selectedRowKeys.length})
            </Button>
          )}
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          defaultPageSize: 10,
          position: ["bottomRight"],
          size: "default",
          total: filteredData.length,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        scroll={{ x: 1000 }}
      />

      <PendingProductsModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </ConfigProvider>
  );
}

export default PendingProducts;
