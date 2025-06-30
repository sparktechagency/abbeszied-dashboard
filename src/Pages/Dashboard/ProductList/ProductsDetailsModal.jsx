import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaClock,
  FaTimes,
  FaMapMarkerAlt,
  FaTag,
  FaUser,
} from "react-icons/fa";
import shoe from "../../../assets/shoe.png";
import sneakers1 from "../../../assets/sneakers1.png";
import sneakers2 from "../../../assets/sneakers2.png";
import sneakers3 from "../../../assets/sneakers3.png";
import { imageUrl } from "../../../redux/api/baseApi";

const ProductsDetailsModal = ({ isModalOpen, handleCancel, providerData }) => {
  const fallbackImages = [sneakers1, sneakers2, sneakers3];
  const [mainImage, setMainImage] = useState(shoe);

  useEffect(() => {
    if (providerData?.productImage) {
      setMainImage(providerData.productImage);
    } else {
      setMainImage(shoe);
    }
  }, [providerData, isModalOpen]);

  if (!providerData) {
    return null;
  }

  // Combine actual product images with fallback images for thumbnails
  const productImages = providerData?.originalData?.images || [];
  const allImages = [];

  // Add actual product images with full URL
  productImages.forEach((imagePath) => {
    if (imagePath) {
      allImages.push(`${imageUrl}${imagePath}`);
    }
  });

  // Add fallback images if we have less than 4 images
  const remainingSlots = Math.max(0, 4 - allImages.length);
  allImages.push(...fallbackImages.slice(0, remainingSlots));

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "text-green-600 bg-green-100";
      case "sold":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isModalOpen ? "block" : "hidden"}
      flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="bg-white rounded-lg shadow-xl w-[800px] max-w-[95%] max-h-[95%] overflow-auto p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Product Details</h3>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <img
              src={mainImage}
              alt={providerData?.productName}
              className="w-full h-[350px] object-cover rounded-lg mb-4 border"
              onError={(e) => {
                e.target.src = shoe;
              }}
            />

            {/* Thumbnails */}
            <div className="flex justify-center space-x-2">
              {productImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all
                    ${
                      mainImage === image
                        ? "border-blue-500 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  onClick={() => setMainImage(image)}
                  onError={(e) => {
                    e.target.src = shoe;
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                {providerData?.productName || "Product Name Not Available"}
              </h4>
              <p className="text-2xl text-blue-600 font-bold mb-3">
                {providerData?.price || "Price not available"}
              </p>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  providerData?.status
                )}`}
              >
                {providerData?.status || "Status Unknown"}
              </span>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center space-x-2">
                <FaTag className="text-gray-500" size={16} />
                <span className="font-semibold">Category:</span>
                <span className="text-gray-700">
                  {providerData?.category || "N/A"}
                </span>
              </div>

              {/* Condition */}
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Condition:</span>
                <span className="text-gray-700">
                  {providerData?.condition || "N/A"}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-gray-500" size={16} />
                <span className="font-semibold">Location:</span>
                <span className="text-gray-700">
                  {providerData?.location || "Location not specified"}
                </span>
              </div>

              {/* Description */}
              <div>
                <span className="font-semibold">Description:</span>
                <p className="text-gray-600 mt-1 leading-relaxed">
                  {providerData?.description ||
                    "No description available for this product."}
                </p>
              </div>

              {/* Seller Information */}
              <div className="border-t pt-4 mt-4">
                <span className="font-semibold text-lg">
                  Seller Information:
                </span>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-500" size={16} />
                    <span className="font-medium text-gray-800">
                      {providerData?.submittedBy || "Seller name not available"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock size={16} />
                    <span>Posted: {formatDate(providerData?.createdAt)}</span>
                  </div>

                  {providerData?.updatedAt &&
                    providerData?.updatedAt !== providerData?.createdAt && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaClock size={16} />
                        <span>
                          Last Updated: {formatDate(providerData?.updatedAt)}
                        </span>
                      </div>
                    )}

                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaPhone size={16} />
                    <span>Contact seller for phone number</span>
                  </div>
                </div>
              </div>

              {/* Additional Product Info */}
              {providerData?.originalData && (
                <div className="border-t pt-4 mt-4">
                  <span className="font-semibold">Additional Information:</span>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>
                      <strong>Product ID:</strong>{" "}
                      {providerData.originalData._id}
                    </p>
                    {providerData.originalData.sellerId?._id && (
                      <p>
                        <strong>Seller ID:</strong>{" "}
                        {providerData.originalData.sellerId._id}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetailsModal;
