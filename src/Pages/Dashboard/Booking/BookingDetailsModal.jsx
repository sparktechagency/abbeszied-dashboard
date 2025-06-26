import React from "react";
import { Modal, Descriptions, Tag, Avatar, Divider } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const BookingDetailsModal = ({ visible, onClose, bookingData }) => {
  if (!bookingData) return null;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "cancelled":
        return "red";
      case "confirmed":
        return "blue";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "green";
      case "pending":
        return "orange";
      case "refunded":
        return "blue";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = dayjs(dateString);
    return date.isValid() ? date.format("DD MMM YYYY, hh:mm A") : dateString;
  };

  const formatScheduledTime = () => {
    if (bookingData.selectedDay && bookingData.startTime) {
      const date = dayjs(bookingData.selectedDay);
      if (date.isValid()) {
        return `${date.format("DD MMM YYYY")} at ${bookingData.startTime}${
          bookingData.endTime ? ` - ${bookingData.endTime}` : ""
        }`;
      }
    }
    return "N/A";
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <CalendarOutlined />
          <span>Booking Details</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      className="booking-details-modal"
    >
      <div className="space-y-6">
        {/* Basic Booking Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Booking Information
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Booking ID" span={1}>
              <span className="font-medium">
                {bookingData.orderNumber || bookingData._id}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Session Package" span={1}>
              <Tag color="blue" className="capitalize">
                {bookingData.sessionPackage || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Booking Status" span={1}>
              <Tag
                color={getStatusColor(bookingData.bookingStatus)}
                className="capitalize"
              >
                {bookingData.bookingStatus || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Session Status" span={1}>
              <Tag
                color={getStatusColor(bookingData.sessionStatus)}
                className="capitalize"
              >
                {bookingData.sessionStatus || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Scheduled Time" span={2}>
              <span className="text-gray-800">{formatScheduledTime()}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Client Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Client Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={bookingData.userId?.image}
                icon={<UserOutlined />}
                size={40}
              />
              <div>
                <h4 className="font-medium text-gray-800">
                  {bookingData.userId?.fullName || "N/A"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {bookingData.userId?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coach Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Coach Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Avatar
                src={bookingData.coachId?.image}
                icon={<UserOutlined />}
                size={40}
              />
              <div>
                <h4 className="font-medium text-gray-800">
                  {bookingData.coachId?.fullName || "N/A"}
                </h4>
                <p className="text-gray-600 text-sm">
                  {bookingData.coachId?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Divider />

        {/* Session Details */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Session Details
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Session ID" span={1}>
              {bookingData.sessionId?._id || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Price Per Session" span={1}>
              <span className="font-medium text-green-600">
                ${bookingData.sessionId?.pricePerSession || 0}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Total Price" span={1}>
              <span className="font-medium text-green-600">
                ${bookingData.price || 0}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="About Session" span={2}>
              {bookingData.sessionId?.aboutMe || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* Payment & Reschedule Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Payment & Reschedule Info
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Payment Status" span={1}>
              <Tag
                color={getPaymentStatusColor(bookingData.paymentStatus)}
                className="capitalize"
              >
                {bookingData.paymentStatus || "N/A"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Intent ID" span={1}>
              <span className="text-xs text-gray-600 font-mono">
                {bookingData.paymentIntentId || "N/A"}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Is Rescheduled" span={1}>
              <Tag color={bookingData.isRescheduled ? "orange" : "default"}>
                {bookingData.isRescheduled ? "Yes" : "No"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reschedule Count" span={1}>
              <span className="font-medium">
                {bookingData.rescheduleCount || 0}
              </span>
            </Descriptions.Item>
            {bookingData.cancellationReason && (
              <Descriptions.Item label="Cancellation Reason" span={2}>
                <span className="text-red-600">
                  {bookingData.cancellationReason}
                </span>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>

        <Divider />

        {/* Timestamps */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Timeline</h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Created At">
              {formatDate(bookingData.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {formatDate(bookingData.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
