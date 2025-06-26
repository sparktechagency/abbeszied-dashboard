// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   ConfigProvider,
//   Modal,
//   message,
//   Button,
//   Tag,
//   Select,
//   Spin,
// } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import ButtonEDU from "../../../components/common/ButtonEDU";
// import man from "../../../assets/man.png";
// import { FiEdit2 } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import GetPageName from "../../../components/common/GetPageName";
// import SliderModal from "./SliderModal"; // Import the separate modal
// import { useGetBannersQuery } from "../../../redux/apiSlices/bannerSlice";
// import { getImageUrl } from "../../../utils/baseUrl";

// function Slider() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingData, setEditingData] = useState(null);
//   const [type, setType] = useState("client");

//   const {
//     data: sliderData,
//     isLoading,
//     error,
//     refetch,
//   } = useGetBannersQuery(type.toLowerCase());

//   const [tableData, setTableData] = useState([]);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deletingRecord, setDeletingRecord] = useState(null);

//   // Debug logging
//   console.log("=== DEBUG INFO ===");
//   console.log("Full API Response:", sliderData);
//   console.log("API Data Array:", sliderData?.data);
//   console.log("Type:", type);
//   console.log("Table Data:", tableData);
//   console.log("Table Data Length:", tableData?.length);

//   // Update tableData when API data changes
//   // Update the useEffect that processes the data
//   useEffect(() => {
//     console.log("=== useEffect TRIGGERED ===");
//     console.log("sliderData:", sliderData);
//     console.log("sliderData exists:", !!sliderData);
//     console.log("sliderData is array:", Array.isArray(sliderData));

//     // Check if sliderData is directly an array or has a data property that's an array
//     if (Array.isArray(sliderData)) {
//       console.log("✅ Processing direct array:", sliderData);
//       const formattedData = sliderData.map((item, index) => {
//         console.log(`Processing item ${index}:`, item);
//         const formatted = {
//           key: item._id || `temp-${index}`,
//           serial: index + 1,
//           sliderimg: item.image ? `${getImageUrl}${item.image}` : man,
//           type: item.type,
//           name: item.name,
//           _id: item._id,
//           createdAt: item.createdAt,
//           updatedAt: item.updatedAt,
//         };
//         console.log(`Formatted item ${index}:`, formatted);
//         return formatted;
//       });
//       console.log("✅ Final formatted data:", formattedData);
//       setTableData(formattedData);
//     } else if (sliderData?.data && Array.isArray(sliderData.data)) {
//       console.log("✅ Processing data property:", sliderData.data);
//       const formattedData = sliderData.data.map((item, index) => ({
//         key: item._id || `temp-${index}`,
//         serial: index + 1,
//         sliderimg: item.image
//           ? `${process.env.REACT_APP_API_BASE_URL || ""}${item.image}`
//           : man,
//         type: item.type,
//         name: item.name,
//         _id: item._id,
//         createdAt: item.createdAt,
//         updatedAt: item.updatedAt,
//       }));
//       console.log("✅ Final formatted data:", formattedData);
//       setTableData(formattedData);
//     } else {
//       console.log("❌ No valid data found, setting empty array");
//       console.log("sliderData type:", typeof sliderData);
//       console.log("sliderData value:", sliderData);
//       setTableData([]);
//     }
//   }, [sliderData]);

//   // Additional effect to track tableData changes
//   useEffect(() => {
//     console.log("=== TABLE DATA CHANGED ===");
//     console.log("New tableData:", tableData);
//     console.log("Length:", tableData?.length);
//   }, [tableData]);

//   const showModal = () => {
//     setIsEditing(false);
//     setEditingData(null);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setIsEditing(false);
//     setEditingData(null);
//   };

//   const handleModalSubmit = (formData) => {
//     // After successful API call, refetch the data
//     refetch();

//     if (isEditing) {
//       message.success("Slider updated successfully!");
//     } else {
//       message.success("Slider added successfully!");
//     }
//   };

//   const handleEdit = (record) => {
//     setIsEditing(true);
//     setEditingData(record);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (key) => {
//     setDeletingRecord(tableData.find((item) => item.key === key));
//     setIsDeleteModalOpen(true);
//   };

//   const onConfirmDelete = async () => {
//     try {
//       // Call your delete API here
//       // await deleteBanner(deletingRecord._id);

//       // After successful deletion, refetch the data
//       refetch();
//       message.success("Slider deleted successfully!");
//     } catch (error) {
//       message.error("Failed to delete slider!");
//     } finally {
//       setIsDeleteModalOpen(false);
//       setDeletingRecord(null);
//     }
//   };

//   const handleChange = (value) => {
//     console.log(`selected ${value}`);
//     setType(value);
//   };

//   const getTypeColor = (type) => {
//     switch (type?.toLowerCase()) {
//       case "client":
//         return "blue";
//       case "coach":
//         return "green";
//       case "corporate":
//         return "purple";
//       default:
//         return "default";
//     }
//   };

//   const columns = [
//     {
//       title: "Sl",
//       dataIndex: "serial",
//       width: "10%",
//       render: (serial) => (
//         <p className="font-bold text-black text-[16px]">
//           {serial.toString().padStart(2, "0")}
//         </p>
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       width: "20%",
//       render: (name) => (
//         <p className="font-medium text-gray-800">{name || "N/A"}</p>
//       ),
//     },
//     {
//       title: "Slider Image",
//       dataIndex: "sliderimg",
//       width: "20%",
//       render: (sliderimg) => (
//         <img
//           width={60}
//           height={60}
//           src={sliderimg}
//           alt="slider"
//           className="object-cover rounded-md border border-gray-200"
//           onError={(e) => {
//             e.target.src = man; // Fallback to default image
//           }}
//         />
//       ),
//     },
//     {
//       title: "Type",
//       dataIndex: "type",
//       width: "15%",
//       render: (type) => (
//         <Tag color={getTypeColor(type)} className="capitalize font-medium">
//           {type || "N/A"}
//         </Tag>
//       ),
//     },
//     {
//       title: "Created Date",
//       dataIndex: "createdAt",
//       width: "20%",
//       render: (createdAt) => (
//         <p className="text-gray-600">
//           {createdAt
//             ? new Date(createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//               })
//             : "N/A"}
//         </p>
//       ),
//     },
//     {
//       title: "Actions",
//       width: "15%",
//       render: (_, record) => (
//         <div className="flex gap-4">
//           <FiEdit2
//             className="text-black hover:text-blue-500 cursor-pointer text-xl transition-colors duration-200"
//             onClick={() => handleEdit(record)}
//           />
//           <RiDeleteBin6Line
//             className="text-black hover:text-red-500 cursor-pointer text-xl transition-colors duration-200"
//             onClick={() => handleDelete(record.key)}
//           />
//         </div>
//       ),
//     },
//   ];

//   // Debug logging for API state
//   console.log("API Loading state:", isLoading);
//   console.log("API Error state:", error);

//   // Loading state
//   if (isLoading) {
//     console.log("Showing loading spinner");
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spin size="large" />
//         <p className="ml-4">Loading banners...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     console.log("API Error:", error);
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <p className="text-red-500 mb-4">Failed to load banners</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Error: {error?.message || JSON.stringify(error)}
//           </p>
//           <Button onClick={() => refetch()}>Try Again</Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <ConfigProvider
//       theme={{
//         components: {
//           Table: {
//             rowSelectedBg: "#f6f6f6",
//             headerBg: "#f6f6f6",
//             cellFontSize: "16px",
//             cellPaddingBlock: 12,
//           },
//         },
//       }}
//     >
//       <div>
//         <div className="flex justify-between items-center py-5">
//           <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
//           <div className="flex gap-4 items-center">
//             <Select
//               value={type}
//               onChange={handleChange}
//               className="w-32"
//               options={[
//                 { value: "client", label: "Client" },
//                 { value: "coach", label: "Coach" },
//                 { value: "corporate", label: "Corporate" },
//               ]}
//             />
//             <Button
//               icon={<PlusOutlined />}
//               className="bg-abbes h-9 text-white px-4 rounded-md hover:bg-opacity-90 transition-all duration-200"
//               onClick={showModal}
//             >
//               Add New
//             </Button>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm">
//           <Table
//             columns={columns}
//             dataSource={tableData}
//             pagination={{
//               pageSize: 10,
//               showSizeChanger: true,
//               showQuickJumper: true,
//               showTotal: (total, range) =>
//                 `${range[0]}-${range[1]} of ${total} items`,
//             }}
//             className="rounded-lg overflow-hidden"
//             locale={{
//               emptyText:
//                 tableData.length === 0 ? `No ${type} banners found` : "No data",
//             }}
//             loading={isLoading}
//           />
//         </div>

//         {/* Delete Confirmation Modal */}
//         <Modal
//           title="Delete Confirmation"
//           open={isDeleteModalOpen}
//           onCancel={() => {
//             setIsDeleteModalOpen(false);
//             setDeletingRecord(null);
//           }}
//           footer={null}
//           centered
//         >
//           <div className="text-center py-4">
//             <div className="mb-4 text-gray-600">
//               Are you sure you want to delete "{deletingRecord?.name}" slider?
//             </div>
//             <div className="flex justify-center gap-4">
//               <ButtonEDU
//                 actionType="cancel"
//                 onClick={() => {
//                   setIsDeleteModalOpen(false);
//                   setDeletingRecord(null);
//                 }}
//               >
//                 Cancel
//               </ButtonEDU>
//               <ButtonEDU actionType="delete" onClick={onConfirmDelete}>
//                 Delete
//               </ButtonEDU>
//             </div>
//           </div>
//         </Modal>

//         {/* Slider Add/Edit Modal */}
//         <SliderModal
//           isVisible={isModalOpen}
//           onClose={handleModalClose}
//           onSubmit={handleModalSubmit}
//           isEditing={isEditing}
//           editingData={editingData}
//         />
//       </div>
//     </ConfigProvider>
//   );
// }

// export default Slider;

import React, { useState, useEffect } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  message,
  Button,
  Tag,
  Select,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import man from "../../../assets/man.png";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";
import SliderModal from "./SliderModal"; // Import the separate modal
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useUpdateStatusMutation,
} from "../../../redux/apiSlices/bannerSlice";
import { getImageUrl } from "../../../utils/baseUrl";

function Slider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [type, setType] = useState("client");

  const {
    data: sliderData,
    isLoading,
    error,
    refetch,
  } = useGetBannersQuery(type.toLowerCase());

  // API mutations
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: isDeleting }] = useDeleteBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateStatusMutation();

  const [tableData, setTableData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // Debug logging
  console.log("=== DEBUG INFO ===");
  console.log("Full API Response:", sliderData);
  console.log("API Data Array:", sliderData?.data);
  console.log("Type:", type);
  console.log("Table Data:", tableData);
  console.log("Table Data Length:", tableData?.length);

  // Update tableData when API data changes
  useEffect(() => {
    console.log("=== useEffect TRIGGERED ===");
    console.log("sliderData:", sliderData);
    console.log("sliderData exists:", !!sliderData);
    console.log("sliderData is array:", Array.isArray(sliderData));

    // Check if sliderData is directly an array or has a data property that's an array
    if (Array.isArray(sliderData)) {
      console.log("✅ Processing direct array:", sliderData);
      const formattedData = sliderData.map((item, index) => {
        console.log(`Processing item ${index}:`, item);
        const formatted = {
          key: item._id || `temp-${index}`,
          serial: index + 1,
          sliderimg: item.image ? `${getImageUrl}${item.image}` : man,
          type: item.type,
          name: item.name,
          _id: item._id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
        console.log(`Formatted item ${index}:`, formatted);
        return formatted;
      });
      console.log("✅ Final formatted data:", formattedData);
      setTableData(formattedData);
    } else if (sliderData?.data && Array.isArray(sliderData.data)) {
      console.log("✅ Processing data property:", sliderData.data);
      const formattedData = sliderData.data.map((item, index) => ({
        key: item._id || `temp-${index}`,
        serial: index + 1,
        sliderimg: item.image
          ? `${process.env.REACT_APP_API_BASE_URL || ""}${item.image}`
          : man,
        type: item.type,
        name: item.name,
        _id: item._id,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));
      console.log("✅ Final formatted data:", formattedData);
      setTableData(formattedData);
    } else {
      console.log("❌ No valid data found, setting empty array");
      console.log("sliderData type:", typeof sliderData);
      console.log("sliderData value:", sliderData);
      setTableData([]);
    }
  }, [sliderData]);

  // Additional effect to track tableData changes
  useEffect(() => {
    console.log("=== TABLE DATA CHANGED ===");
    console.log("New tableData:", tableData);
    console.log("Length:", tableData?.length);
  }, [tableData]);

  const showModal = () => {
    setIsEditing(false);
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingData(null);
  };

  const handleModalSubmit = async (formData) => {
    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields to FormData
      submitData.append("name", formData.name);
      submitData.append("type", formData.type);

      // Handle image upload
      if (formData.imageFile) {
        // If there's a new image file
        submitData.append("image", formData.imageFile);
      } else if (
        isEditing &&
        formData.sliderimg &&
        !formData.sliderimg.startsWith("data:")
      ) {
        // If editing and keeping existing image (not base64)
        // The existing image URL will be handled by the backend
      }

      if (isEditing && editingData?._id) {
        // Update existing banner
        await updateBanner({
          id: editingData._id,
          data: submitData,
        }).unwrap();
        message.success("Slider updated successfully!");
      } else {
        // Create new banner
        await createBanner(submitData).unwrap();
        message.success("Slider added successfully!");
      }

      // Refetch data and close modal
      refetch();
      handleModalClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error(
        isEditing ? "Failed to update slider!" : "Failed to add slider!"
      );
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingData(record);
    setIsModalOpen(true);
  };

  const handleDelete = (key) => {
    setDeletingRecord(tableData.find((item) => item.key === key));
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteBanner(deletingRecord._id).unwrap();
      message.success("Slider deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete slider!");
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingRecord(null);
    }
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setType(value);
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "client":
        return "blue";
      case "coach":
        return "green";
      case "corporate":
        return "purple";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      width: "10%",
      render: (serial) => (
        <p className="font-bold text-black text-[16px]">
          {serial.toString().padStart(2, "0")}
        </p>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: "20%",
      render: (name) => (
        <p className="font-medium text-gray-800">{name || "N/A"}</p>
      ),
    },
    {
      title: "Slider Image",
      dataIndex: "sliderimg",
      width: "20%",
      render: (sliderimg) => (
        <img
          width={60}
          height={60}
          src={sliderimg}
          alt="slider"
          className="object-cover rounded-md border border-gray-200"
          onError={(e) => {
            e.target.src = man; // Fallback to default image
          }}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "15%",
      render: (type) => (
        <Tag color={getTypeColor(type)} className="capitalize font-medium">
          {type || "N/A"}
        </Tag>
      ),
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      width: "20%",
      render: (createdAt) => (
        <p className="text-gray-600">
          {createdAt
            ? new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A"}
        </p>
      ),
    },
    {
      title: "Actions",
      width: "15%",
      render: (_, record) => (
        <div className="flex gap-4">
          <FiEdit2
            className="text-black hover:text-blue-500 cursor-pointer text-xl transition-colors duration-200"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            className="text-black hover:text-red-500 cursor-pointer text-xl transition-colors duration-200"
            onClick={() => handleDelete(record.key)}
          />
        </div>
      ),
    },
  ];

  // Debug logging for API state
  console.log("API Loading state:", isLoading);
  console.log("API Error state:", error);

  // Loading state
  if (isLoading) {
    console.log("Showing loading spinner");
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
        <p className="ml-4">Loading banners...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    console.log("API Error:", error);
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load banners</p>
          <p className="text-sm text-gray-500 mb-4">
            Error: {error?.message || JSON.stringify(error)}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
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
            cellFontSize: "16px",
            cellPaddingBlock: 12,
          },
        },
      }}
    >
      <div>
        <div className="flex justify-between items-center py-5">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <div className="flex gap-4 items-center">
            <Select
              value={type}
              onChange={handleChange}
              className="w-32"
              options={[
                { value: "client", label: "Client" },
                { value: "coach", label: "Coach" },
                { value: "corporate", label: "Corporate" },
              ]}
            />
            <Button
              icon={<PlusOutlined />}
              className="bg-abbes h-9 text-white px-4 rounded-md hover:bg-opacity-90 transition-all duration-200"
              onClick={showModal}
              loading={isCreating}
            >
              Add New
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} items`,
            }}
            className="rounded-lg overflow-hidden"
            locale={{
              emptyText:
                tableData.length === 0 ? `No ${type} banners found` : "No data",
            }}
            loading={isLoading || isCreating || isUpdating}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Confirmation"
          open={isDeleteModalOpen}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setDeletingRecord(null);
          }}
          footer={null}
          centered
        >
          <div className="text-center py-4">
            <div className="mb-4 text-gray-600">
              Are you sure you want to delete "{deletingRecord?.name}" slider?
            </div>
            <div className="flex justify-center gap-4">
              <ButtonEDU
                actionType="cancel"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingRecord(null);
                }}
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

        {/* Slider Add/Edit Modal */}
        <SliderModal
          isVisible={isModalOpen}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
          isEditing={isEditing}
          editingData={editingData}
          isLoading={isCreating || isUpdating}
        />
      </div>
    </ConfigProvider>
  );
}

export default Slider;
