import React, { useState, useMemo } from "react";
import { Table, ConfigProvider, Input, Button, Tooltip, message } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import GetPageName from "../../../components/common/GetPageName";
// import shoe from "../../../assets/shoe.png";
import ProductsDetailsModal from "./ProductsDetailsModal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgEye } from "react-icons/cg";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../redux/apiSlices/productSlice";
import { getImageUrl } from "../../../utils/baseUrl";

function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setlimit] = useState(20);
  const {
    data: productData,
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery({ page, limit });

  const [deleteProduct] = useDeleteProductMutation();

  // Transform API data to match table structure
  const transformedData = useMemo(() => {
    if (!productData?.data) return [];

    // Option 1: If productData.data is an array and you want to filter approved products
    if (Array.isArray(productData.data)) {
      return productData.data
        .filter((product) => product.isApproved === "approved") // Filter approved products
        .map((product, index) => ({
          key: product._id || index,
          productName: product.name || "N/A",
          category: product.category || "N/A",
          submittedBy: product.sellerId?.fullName || "Unknown Seller",
          price: `Qar ${product.price || 0}`,
          productImage: product.images?.[0]
            ? `${getImageUrl}${product?.images[0]}`
            : null,
          description: product.description || "N/A",
          location: product.location || "N/A",
          status: product.status || "N/A",
          condition: product.condition || "N/A",
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          sellerId: product.sellerId?._id,
          sellerFullName: product.sellerId?.fullName,
          originalData: product,
        }));
    }

    return [];
  }, [productData?.data]);

  // Open the modal and set the selected product data
  const handleModalOpen = (record) => {
    setSelectedProvider(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Filter data based on search query using transformed data
  const filteredData = useMemo(() => {
    if (!searchQuery || !transformedData) return transformedData || [];

    return transformedData.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.price.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transformedData, searchQuery]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleDeleteSelected = () => {
    // Here you would typically call an API to delete the selected products
    console.log("Delete selected products:", selectedRowKeys);
    setSelectedRowKeys([]);
  };

  const handleDelete = (id) => {
    try {
      const res = deleteProduct(id);
      if (res.success) {
        message.success("Product Deleted Successfully");
      }
    } catch (err) {
      message.error(err);
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Image",
      dataIndex: "productImage",
      key: "productImage",

      render: (imageUrl, record) => (
        <img
          src={record.productImage}
          width={80}
          height={80}
          alt={record.productName}
          style={{ objectFit: "cover", borderRadius: "4px" }}
          onError={(e) => {
            e.target.src = shoe; // Fallback image
          }}
        />
      ),
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
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            status === "available"
              ? "bg-green-100 text-green-800"
              : status === "sold"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status || "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",

      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="View Details">
            <CgEye
              size={20}
              className="hover:text-abbes cursor-pointer"
              onClick={() => handleModalOpen(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <RiDeleteBin6Line
              size={20}
              className="hover:text-red-500 cursor-pointer"
              onClick={() => handleDelete(record.key)}
            />
          </Tooltip>
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
          total: filteredData?.length || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        scroll={{ x: 1000 }}
      />

      {/* Modal */}
      <ProductsDetailsModal
        isModalOpen={isModalOpen}
        handleCancel={() => setIsModalOpen(false)}
        providerData={selectedProvider}
      />
    </ConfigProvider>
  );
}

export default ProductList;
