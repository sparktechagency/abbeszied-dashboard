import React, { useState, useEffect } from "react";
import { Button, ConfigProvider, Modal, Image, message } from "antd";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineEnvelope } from "react-icons/hi2";
import man from "../../../assets/man.png";
import certificate from "../../../assets/certificate.png";
import { getImageUrl } from "../../../utils/baseUrl";
import { useApproveOrRejectMutation } from "../../../redux/apiSlices/certificateSlice.js";

const CertificateModal = ({
  isModalOpen,
  handleCancel,
  providerData,
  onSuccess,
}) => {
  const [approveOrReject, { isLoading: isUpdating }] =
    useApproveOrRejectMutation();

  // Handle accept action
  const handleAccept = async () => {
    if (!providerData?._id) {
      message.error("Invalid certificate data");
      return;
    }

    try {
      const res = await approveOrReject({
        id: providerData._id,
        verifiedByAdmin: { verifiedByAdmin: "verified" },
      });

      if (res.data || !res.error) {
        message.success("Certificate approved successfully!");
        onSuccess?.(); // Call parent refresh function
        handleCancel();
      } else {
        message.error("Failed to approve certificate");
      }
    } catch (err) {
      console.error("Approve error:", err);
      message.error("Failed to approve certificate");
    }
  };

  // Handle reject action
  const handleReject = async () => {
    if (!providerData?._id) {
      message.error("Invalid certificate data");
      return;
    }

    try {
      const res = await approveOrReject({
        id: providerData._id,
        verifiedByAdmin: { verifiedByAdmin: "rejected" },
      });

      if (res.data || !res.error) {
        message.success("Certificate rejected successfully!");
        onSuccess?.(); // Call parent refresh function
        handleCancel();
      } else {
        message.error("Failed to reject certificate");
      }
    } catch (err) {
      console.error("Reject error:", err);
      message.error("Failed to reject certificate");
    }
  };

  // If no data is provided, don't render the modal content
  if (!providerData) {
    return null;
  }

  // Check if certificate is already processed
  const isProcessed =
    providerData.verifiedByAdmin === "verified" ||
    providerData.verifiedByAdmin === "rejected";
  const isApproved = providerData.verifiedByAdmin === "verified";
  const isRejected = providerData.verifiedByAdmin === "rejected";

  return (
    <Modal
      title={<p className="text-lg font-semibold">Certificate Details</p>}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="pending-products-modal"
      centered
    >
      <ConfigProvider
        theme={{
          Button: {},
        }}
      >
        <div className="flex justify-between w-full my-2 gap-6">
          {/* Coach Information Section */}
          <div className="w-1/2 flex flex-col">
            <h2 className="font-medium text-lg mb-3">Coach Information</h2>
            <div className="flex gap-3">
              <div>
                <img
                  src={`${getImageUrl}${providerData.userId?.image || man}`}
                  width={60}
                  height={60}
                  className="border rounded-full object-cover"
                  alt="Coach Avatar"
                />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[16px] font-medium">
                  {providerData.userId?.fullName || "N/A"}
                </p>
                <p className="text-gray-600">
                  {providerData.certificateName || "Certificate"}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <FiPhoneCall className="text-gray-500" />
                  {providerData.userId?.phone || "No phone provided"}
                </p>
                <p className="flex items-center gap-2 text-sm">
                  <HiOutlineEnvelope className="text-gray-500" />
                  {providerData.userId?.email || "No email provided"}
                </p>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Submission Date:</p>
                  <p className="text-sm">
                    {providerData.createdAt
                      ? new Date(providerData.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-500">Status:</p>
                  <p
                    className={`text-sm font-medium ${
                      isApproved
                        ? "text-green-600"
                        : isRejected
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {isApproved
                      ? "Verified"
                      : isRejected
                      ? "Rejected"
                      : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Section */}
          <div className="w-1/2">
            <h2 className="font-medium text-lg mb-3">Certificate</h2>
            <div>
              <p className="text-[16px] font-medium mb-3">
                {providerData.certificateName || "Certificate Document"}
              </p>
              <div>
                <div className="mb-4">
                  {providerData.certificateFile ? (
                    <Image
                      src={`${getImageUrl}${providerData.certificateFile}`}
                      width="100%"
                      height={300}
                      className="border rounded-md border-gray-300 object-cover"
                      alt="Certificate"
                      fallback={certificate}
                    />
                  ) : (
                    <div className="border rounded-md border-gray-300 p-8 text-center bg-gray-50">
                      <p className="text-gray-500">
                        No certificate image available
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Only show if not processed */}
                {!isProcessed && (
                  <div className="flex gap-3">
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            defaultHoverBg: "#16a34a",
                            defaultHoverColor: "white",
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={handleAccept}
                        loading={isUpdating}
                        className="bg-green-500/90 hover:bg-green-600 text-white border-none h-9 flex-1"
                        disabled={isUpdating}
                      >
                        Accept
                      </Button>
                    </ConfigProvider>

                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            defaultHoverBg: "#dc2626",
                            defaultHoverColor: "white",
                          },
                        },
                      }}
                    >
                      <Button
                        onClick={handleReject}
                        loading={isUpdating}
                        className="bg-red-500/90 hover:bg-red-600 text-white border-none h-9 flex-1"
                        disabled={isUpdating}
                      >
                        Reject
                      </Button>
                    </ConfigProvider>
                  </div>
                )}

                {/* Status message when processed */}
                {isProcessed && (
                  <div className="text-center p-4 rounded-md bg-gray-50">
                    <p
                      className={`font-medium ${
                        isApproved ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Certificate has been{" "}
                      {isApproved ? "verified" : "rejected"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default CertificateModal;
