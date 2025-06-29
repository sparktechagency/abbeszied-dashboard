import React, { useState, useEffect } from "react";
import man from "../../../assets/man.png";
import { Button, ConfigProvider, Form, Input, Upload, message } from "antd";
import { HiMiniPencil } from "react-icons/hi2";
import { MdCameraEnhance } from "react-icons/md";
import { getImageUrl } from "../../../utils/baseUrl";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../../redux/apiSlices/userSlice";

function Profile() {
  const [showButton, setShowButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  // Add refetch capability and loading/error states
  const { data: userProfile, isLoading, error, refetch } = useProfileQuery();
  console.log("Profile data:", userProfile?.data);

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Handle image upload with better validation
  const handleImageUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt5M = file.size / 1024 / 1024 < 5; // Less than 5MB

    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }

    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return Upload.LIST_IGNORE;
    }

    setUploadedImage(file);
    return false; // Prevent auto upload
  };

  // Reset states when canceling edit
  const handleCancelEdit = () => {
    setShowButton(false);
    setUploadedImage(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-72">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-72">
        <p>Error loading profile</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "#000000",
          },
          Input: {
            colorText: "#000000",
            colorBgBase: "#ffffff",
            colorBorder: "#000000",
            boxShadow: "none",
          },
          Button: {
            defaultHoverBg: "#fd7d00",
            defaultActiveColor: "white",
            defaultBg: "#fd7d00",
            defaultHoverColor: "white",
          },
        },
      }}
    >
      <div className="bg-quilocoP w-full min-h-72 flex flex-col justify-start items-center px-4 border bg-white rounded-lg overflow-hidden">
        {/* Fixed header section with consistent height */}
        <div className="w-full flex flex-col items-center pt-6 pb-4">
          <div className="relative flex flex-col items-center justify-center">
            {/* Fixed image container with consistent dimensions */}
            <div className="relative w-[120px] h-[120px] border border-slate-500 rounded-full overflow-hidden">
              <img
                src={
                  uploadedImage
                    ? URL.createObjectURL(uploadedImage)
                    : userProfile?.data?.image
                    ? `${getImageUrl}${userProfile?.data?.image}`
                    : man
                }
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>

            {showButton && (
              <Upload
                showUploadList={false}
                beforeUpload={handleImageUpload}
                accept="image/*"
              >
                <button
                  type="button"
                  className="absolute top-[5rem] left-[6rem]"
                >
                  <MdCameraEnhance
                    size={30}
                    className="text-white border rounded-full bg-abbes p-1 hover:bg-abbes/80 transition-colors"
                  />
                </button>
              </Upload>
            )}
          </div>

          {/* Fixed height container for name to prevent layout shift */}
          <div className="h-[2.5rem] flex items-center mt-3">
            <h3 className="text-black text-xl text-center">
              {userProfile?.data?.fullName || "User Name"}
            </h3>
          </div>
        </div>

        <div className="w-full flex justify-end mb-4">
          <Button
            onClick={() => {
              if (showButton) {
                handleCancelEdit();
              } else {
                setShowButton(true);
              }
            }}
            icon={
              showButton ? null : (
                <HiMiniPencil size={20} className="text-white" />
              )
            }
            className="bg-abbes/80 border-none text-white min-w-20 min-h-8 text-xs rounded-lg hover:bg-abbes hover:text-white transition-colors"
          >
            {showButton ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        {/* Form container with max width and proper spacing */}
        <div className="w-full max-w-full px-2">
          <ProfileDetails
            showButton={showButton}
            setShowButton={setShowButton}
            user={userProfile?.data}
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
            isUpdating={isUpdating}
            refetchProfile={refetch}
            updateProfile={updateProfile} // Pass the mutation function
          />
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Profile;

const ProfileDetails = ({
  showButton,
  setShowButton,
  user,
  uploadedImage,
  setUploadedImage,
  isUpdating,
  refetchProfile,
  updateProfile, // Receive the mutation function as prop
}) => {
  const [form] = Form.useForm();

  // Set form values whenever user data changes
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      });
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    try {
      const formData = new FormData();

      // Always include the data object
      const data = {
        fullName: values.name?.trim(),
        phone: values.phone?.trim(),
      };

      formData.append("data", JSON.stringify(data));

      // Only append image if there's a new one uploaded
      if (uploadedImage) {
        formData.append("image", uploadedImage);
      }

      console.log("Updating profile with data:", data);
      console.log("Has new image:", !!uploadedImage);

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        message.success("Profile updated successfully!");
        setShowButton(false);
        setUploadedImage(null);

        // Refetch profile data to ensure UI is updated
        if (refetchProfile) {
          refetchProfile();
        }
      } else {
        message.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Form: {
            labelColor: "#000000",
          },
          Input: {
            colorText: "#000000",
            colorBgBase: "#ffffff",
            colorBorder: "#000000",
            boxShadow: "none",
          },
          Button: {
            defaultHoverBg: "#fd7d00",
            defaultActiveColor: "white",
            defaultBg: "#fd7d00",
            defaultHoverColor: "white",
          },
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="w-full max-w-full"
        preserve={false} // Don't preserve form values when component unmounts
      >
        <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
          <Form.Item
            name="name"
            label={<p className="text-black font-medium text-sm">Name</p>}
            className="w-full flex-1 mb-3"
            rules={[
              { required: false, message: "Name is required" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 50, message: "Name must be less than 50 characters" },
            ]}
          >
            <Input
              className="bg-white border border-black h-8 rounded-lg focus:border-abbes text-sm"
              readOnly={!showButton}
              style={{ color: "black" }}
              placeholder="Enter your name"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={<p className="text-black font-medium text-sm">Email</p>}
            className="w-full flex-1 mb-3"
          >
            <Input
              className="bg-gray-100 border border-gray-400 h-8 rounded-lg text-sm"
              readOnly
              style={{ color: "gray" }}
              placeholder="Email address"
            />
          </Form.Item>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2 w-full">
          <Form.Item
            name="phone"
            label={<p className="text-black font-medium text-sm">Phone</p>}
            className="w-full flex-1 mb-3"
            rules={[
              { required: false, message: "Phone number is required" },
              {
                pattern: /^[+]?[\d\s\-()]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input
              className="bg-white border border-black h-8 rounded-lg focus:border-abbes text-sm"
              readOnly={!showButton}
              style={{ color: "black" }}
              placeholder="Enter phone number"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label={<p className="text-black font-medium text-sm">Role</p>}
            className="w-full flex-1 mb-3"
          >
            <Input
              className="bg-gray-100 border border-gray-400 h-8 rounded-lg text-sm"
              readOnly
              style={{ color: "gray" }}
              placeholder="User role"
            />
          </Form.Item>
        </div>

        {showButton && (
          <Form.Item className="mb-2">
            <Button
              block
              htmlType="submit"
              loading={isUpdating}
              className="bg-abbes hover:bg-abbes/80 border-none text-white min-w-20 min-h-10 text-sm rounded-lg font-medium transition-colors"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </Form.Item>
        )}
      </Form>
    </ConfigProvider>
  );
};
