// import React, { useState, useEffect } from "react";
// import { FaPhone, FaClock, FaTimes, FaCheck } from "react-icons/fa";
// import { Button, ConfigProvider } from "antd";
// import shoe from "../../../assets/shoe.png"; // You can use a default image if necessary
// import sneakers1 from "../../../assets/sneakers1.png";
// import sneakers2 from "../../../assets/sneakers2.png";
// import sneakers3 from "../../../assets/sneakers3.png";

// const PendingProductsModal = ({ isModalOpen, handleCancel, providerData }) => {
//   const fallbackImages = [sneakers1, sneakers2, sneakers3];

//   const [mainImage, setMainImage] = useState(shoe);

//   useEffect(() => {
//     if (providerData?.productImage) {
//       setMainImage(providerData.productImage);
//     } else {
//       setMainImage(shoe);
//     }
//   }, [providerData, isModalOpen]);

//   if (!providerData) {
//     return null;
//   }

//   // Use API images if available, otherwise fallback to predefined images
//   const apiImages = providerData?.originalData?.images || [];
//   const images =
//     apiImages.length > 0
//       ? apiImages
//       : [providerData?.productImage, ...fallbackImages];

//   // Format date helper
//   const formatDate = (dateString) => {
//     if (!dateString) return "Unknown date";
//     const date = new Date(dateString);
//     return (
//       date.toLocaleDateString() +
//       " " +
//       date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 ${isModalOpen ? "block" : "hidden"}
//       flex items-center justify-center bg-black bg-opacity-50`}
//     >
//       <div className="bg-white rounded-lg shadow-xl w-[700px] max-w-[90%] max-h-[90%] overflow-auto p-6">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">Product Details</h3>
//           <button
//             onClick={handleCancel}
//             className="text-gray-600 hover:text-gray-900"
//           >
//             <FaTimes size={24} />
//           </button>
//         </div>

//         {/* Modal Content */}
//         <div className="grid grid-cols-2 gap-4">
//           {/* Product Image */}
//           <div>
//             <img
//               src={mainImage}
//               alt="Product"
//               className="w-full h-[300px] object-cover rounded-lg mb-4"
//               onError={(e) => {
//                 e.target.src = shoe; // Fallback image
//               }}
//             />

//             {/* Thumbnails */}
//             <div className="flex justify-center space-x-2">
//               {images.slice(0, 4).map((image, index) => (
//                 <img
//                   key={index}
//                   src={image}
//                   alt={`Thumbnail ${index + 1}`}
//                   className={`w-12 h-12 object-cover rounded cursor-pointer
//                     ${mainImage === image ? "border-2 border-blue-500" : ""}`}
//                   onClick={() => setMainImage(image)}
//                   onError={(e) => {
//                     e.target.src = shoe; // Fallback image
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Product Details */}
//           <div>
//             <h4 className="text-lg font-semibold mb-2">
//               {providerData?.productName || "Product Name Not Available"}
//             </h4>
//             <p className="text-lg text-blue-600 font-bold mb-2">
//               {providerData?.price || "Price Not Available"}
//             </p>

//             <div className="space-y-2">
//               <p>
//                 <span className="font-semibold">Product Condition:</span>{" "}
//                 {providerData?.condition || "Condition Not Specified"}
//               </p>

//               <div>
//                 <span className="font-semibold">Description:</span>
//                 <p className="text-gray-600">
//                   {providerData?.description || "No description available"}
//                 </p>
//               </div>

//               <p>
//                 <span className="font-semibold">Location:</span>{" "}
//                 {providerData?.location || "Location Not Available"}
//               </p>

//               <p>
//                 <span className="font-semibold">Category:</span>{" "}
//                 {providerData?.category || "Category Not Available"}
//               </p>

//               <p>
//                 <span className="font-semibold">Status:</span>
//                 <span
//                   className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
//                     providerData?.isApproved === "approved"
//                       ? "bg-green-100 text-green-800"
//                       : providerData?.isApproved === "rejected"
//                       ? "bg-red-100 text-red-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {providerData?.isApproved || "pending"}
//                 </span>
//               </p>

//               <div>
//                 <span className="font-semibold">Seller Information:</span>
//                 <div className="mt-2 space-y-1">
//                   <p className="font-medium">
//                     {providerData?.submittedBy || "Seller Name Not Available"}
//                   </p>
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <FaClock size={16} />
//                     <span>Posted {formatDate(providerData?.createdAt)}</span>
//                   </div>
//                   {providerData?.updatedAt &&
//                     providerData?.updatedAt !== providerData?.createdAt && (
//                       <div className="flex items-center space-x-2 text-gray-600">
//                         <FaClock size={16} />
//                         <span>
//                           Updated {formatDate(providerData?.updatedAt)}
//                         </span>
//                       </div>
//                     )}
//                   <div className="flex items-center space-x-2 text-gray-600">
//                     <FaPhone size={16} />
//                     <span>Contact seller for phone number</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Approve & Reject Buttons */}
//         <div className="flex justify-center mt-6 space-x-4">
//           <ConfigProvider
//             theme={{
//               components: {
//                 Button: {
//                   defaultHoverBg: "#16a34a  ",
//                   defaultHoverColor: "white",
//                 },
//               },
//             }}
//           >
//             <Button
//               onClick={() => {
//                 console.log("Approve product:", providerData);
//                 // Add your approve logic here
//               }}
//               className="bg-green-500/90 hover:bg-green-600 text-white border-none h-5"
//             >
//               Accept
//             </Button>
//           </ConfigProvider>
//           <ConfigProvider
//             theme={{
//               components: {
//                 Button: {
//                   defaultHoverBg: "#dc2626   ",
//                   defaultHoverColor: "white",
//                   colorPrimaryBg: "#dc2626  ",
//                 },
//               },
//             }}
//           >
//             <Button
//               onClick={() => {
//                 console.log("Reject product:", providerData);
//                 // Add your reject logic here
//               }}
//               className="ml-4 bg-red-500/90 hover:bg-red-600 text-white border-none h-5"
//             >
//               Reject
//             </Button>
//           </ConfigProvider>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PendingProductsModal;

import React, { useState, useEffect } from "react";
import { FaPhone, FaClock, FaTimes, FaCheck } from "react-icons/fa";
import { Button, ConfigProvider } from "antd";
import shoe from "../../../assets/shoe.png"; // You can use a default image if necessary
import sneakers1 from "../../../assets/sneakers1.png";
import sneakers2 from "../../../assets/sneakers2.png";
import sneakers3 from "../../../assets/sneakers3.png";

const PendingProductsModal = ({
  isModalOpen,
  handleCancel,
  providerData,
  onApprove,
  onReject,
}) => {
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

  // Use API images if available, otherwise fallback to predefined images
  const apiImages = providerData?.originalData?.images || [];
  const images =
    apiImages.length > 0
      ? apiImages
      : [providerData?.productImage, ...fallbackImages];

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isModalOpen ? "block" : "hidden"} 
      flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="bg-white rounded-lg shadow-xl w-[700px] max-w-[90%] max-h-[90%] overflow-auto p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Product Details</h3>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-2 gap-4">
          {/* Product Image */}
          <div>
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-[300px] object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = shoe; // Fallback image
              }}
            />

            {/* Thumbnails */}
            <div className="flex justify-center space-x-2">
              {images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-12 h-12 object-cover rounded cursor-pointer 
                    ${mainImage === image ? "border-2 border-blue-500" : ""}`}
                  onClick={() => setMainImage(image)}
                  onError={(e) => {
                    e.target.src = shoe; // Fallback image
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h4 className="text-lg font-semibold mb-2">
              {providerData?.productName || "Product Name Not Available"}
            </h4>
            <p className="text-lg text-blue-600 font-bold mb-2">
              {providerData?.price || "Price Not Available"}
            </p>

            <div className="space-y-2">
              <p>
                <span className="font-semibold">Product Condition:</span>{" "}
                {providerData?.condition || "Condition Not Specified"}
              </p>

              <div>
                <span className="font-semibold">Description:</span>
                <p className="text-gray-600">
                  {providerData?.description || "No description available"}
                </p>
              </div>

              <p>
                <span className="font-semibold">Location:</span>{" "}
                {providerData?.location || "Location Not Available"}
              </p>

              <p>
                <span className="font-semibold">Category:</span>{" "}
                {providerData?.category || "Category Not Available"}
              </p>

              <p>
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    providerData?.isApproved === "approved"
                      ? "bg-green-100 text-green-800"
                      : providerData?.isApproved === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {providerData?.isApproved || "pending"}
                </span>
              </p>

              <div>
                <span className="font-semibold">Seller Information:</span>
                <div className="mt-2 space-y-1">
                  <p className="font-medium">
                    {providerData?.submittedBy || "Seller Name Not Available"}
                  </p>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaClock size={16} />
                    <span>Posted {formatDate(providerData?.createdAt)}</span>
                  </div>
                  {providerData?.updatedAt &&
                    providerData?.updatedAt !== providerData?.createdAt && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <FaClock size={16} />
                        <span>
                          Updated {formatDate(providerData?.updatedAt)}
                        </span>
                      </div>
                    )}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaPhone size={16} />
                    <span>Contact seller for phone number</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Approve & Reject Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "#16a34a  ",
                  defaultHoverColor: "white",
                },
              },
            }}
          >
            <Button
              onClick={() => {
                if (onApprove) {
                  onApprove(providerData);
                }
                handleCancel(); // Close modal after action
              }}
              className="bg-green-500/90 hover:bg-green-600 text-white border-none h-5"
            >
              Accept
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  defaultHoverBg: "#dc2626   ",
                  defaultHoverColor: "white",
                  colorPrimaryBg: "#dc2626  ",
                },
              },
            }}
          >
            <Button
              onClick={() => {
                if (onReject) {
                  onReject(providerData);
                }
                handleCancel(); // Close modal after action
              }}
              className="ml-4 bg-red-500/90 hover:bg-red-600 text-white border-none h-5"
            >
              Reject
            </Button>
          </ConfigProvider>
        </div>
      </div>
    </div>
  );
};

export default PendingProductsModal;
