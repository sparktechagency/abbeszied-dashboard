import React, { useState } from "react";
import {
  Input,
  Table,
  ConfigProvider,
  Button,
  Tooltip,
  Pagination,
} from "antd";
import GetPageName from "../../../components/common/GetPageName";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useGetAllBookingQuery } from "../../../redux/apiSlices/bookingSlice";
import { FiEye } from "react-icons/fi";
import { CgEye } from "react-icons/cg";
import BookingDetailsModal from "./BookingDetailsModal"; // Import the modal component

// Add the custom parse format plugin to dayjs
dayjs.extend(customParseFormat);

const BookingListTable = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: allBookingData, isLoading } = useGetAllBookingQuery({
    page,
    limit,
  });
  console.log("allBookingData", allBookingData?.data);

  // Transform API data to match table structure
  const transformedData =
    allBookingData?.data?.map((booking) => ({
      key: booking._id,
      bookingID: booking.orderNumber || booking._id,
      customername: booking.userId?.fullName || "N/A",
      coach: booking.coachId?.fullName || "N/A",
      status: booking.bookingStatus || "N/A",
      scheduledTime:
        booking.selectedDay && booking.startTime
          ? `${booking.selectedDay} ${booking.startTime}`
          : "N/A",
      location: booking.sessionId?.aboutMe || "N/A",
      price: booking.price || 0,
      rescheduleCount: booking.rescheduleCount || 0,
      paymentStatus: booking.paymentStatus || "N/A",
      sessionPackage: booking.sessionId?.sessionPackage || "N/A",
      originalData: booking, // Keep original data for modal
    })) || [];

  // Filter data based on search text
  const filteredData = transformedData.filter((item) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();

    // Check each searchable field
    return (
      item.bookingID?.toLowerCase().includes(searchLower) ||
      item.customername?.toLowerCase().includes(searchLower) ||
      item.coach?.toLowerCase().includes(searchLower) ||
      item.status?.toLowerCase().includes(searchLower) ||
      item.location?.toLowerCase().includes(searchLower) ||
      item.paymentStatus?.toLowerCase().includes(searchLower) ||
      item.sessionPackage?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "cancelled":
        return "text-red-600";
      case "confirmed":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-600";
      case "pending":
        return "text-yellow-500";
      case "refunded":
        return "text-blue-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Handle modal open
  const handleModalOpen = (record) => {
    setSelectedBooking(record.originalData);
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "bookingID",
      width: "12%",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Client",
      dataIndex: "customername",
      width: "15%",
      render: (text) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Coach",
      dataIndex: "coach",
      width: "15%",
      render: (text) => <span className="text-gray-800">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: (status) => (
        <span className={`capitalize font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      ),
    },
    {
      title: "Scheduled Time",
      dataIndex: "scheduledTime",
      width: "15%",
      render: (scheduledTime) => {
        if (scheduledTime === "N/A")
          return <span className="text-gray-500">N/A</span>;

        // Try to parse and format the date
        const date = dayjs(scheduledTime);
        if (date.isValid()) {
          return (
            <span className="text-gray-800">
              {date.format("DD MMM YYYY, hh:mm A")}
            </span>
          );
        }
        return <span className="text-gray-800">{scheduledTime}</span>;
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "8%",
      render: (price) => (
        <span className="font-medium text-gray-800">${price}</span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      width: "12%",
      render: (status) => (
        <span
          className={`capitalize font-medium ${getPaymentStatusColor(status)}`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Tooltip title="View Details">
            <CgEye
              size={20}
              className="hover:text-abbes cursor-pointer transition-colors duration-200"
              onClick={() => handleModalOpen(record)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
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
            cellFontSize: "14px",
            cellPaddingBlock: 12,
          },
          Pagination: {
            borderRadius: "6px",
            itemActiveBg: "#18a0fb",
          },
        },
      }}
    >
      <div className="flex h-full justify-between items-center py-5 ">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search bookings..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 250, height: 40 }}
          />
        </div>
      </div>

      <div className="max-h-[40vh]  overflow-auto border rounded-md">
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          bordered
          dataSource={filteredData}
          columns={columns}
          rowClassName="hover:bg-gray-50"
          pagination={false}
          scroll={{ x: 1200 }}
        />
      </div>

      <Pagination
        current={page}
        pageSize={limit}
        total={allBookingData?.data?.meta?.total || 0}
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
          setLimit(newPageSize);
        }}
        onShowSizeChange={(current, size) => {
          setPage(1);
          setLimit(size);
        }}
        className="mt-2 text-right"
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        visible={isModalVisible}
        onClose={handleModalClose}
        bookingData={selectedBooking}
      />
    </ConfigProvider>
  );
};

export default BookingListTable;
