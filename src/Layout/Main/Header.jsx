import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { RiSettings5Line, RiShutDownLine } from "react-icons/ri";
import { Badge, Avatar, ConfigProvider, Flex, Popover } from "antd";
import { useUser } from "../../provider/User";
import { CgMenu } from "react-icons/cg";
import { useProfileQuery } from "../../redux/apiSlices/userSlice";
import { getImageUrl } from "../../utils/baseUrl";

const Header = ({ toggleSidebar }) => {
  const { data: profileData } = useProfileQuery();
  console.log("User", profileData?.data);
  const user = profileData?.data;

  // Move userMenuContent inside component to access user data
  const userMenuContent = (
    <div>
      <div className="mr-4 flex gap-2.5 font-semibold hover:text-black cursor-pointer">
        {user?.fullName}
      </div>
      <p>{user?.role}</p>
      <Link
        to="/admin-list"
        className="flex items-center gap-2 py-1 mt-1 text-black hover:text-smart"
      >
        <RiSettings5Line className="text-gray-400 animate-spin" />
        <span>Setting</span>
      </Link>
      <Link
        to="/auth/login"
        className="flex items-center gap-2 py-1 text-black hover:text-smart"
        onClick={() => localStorage.removeItem("accessToken")}
      >
        <RiShutDownLine className="text-red-500 animate-pulse" />
        <span>Log Out</span>
      </Link>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: "16px",
          colorPrimaryBorderHover: "red",
        },
        components: {
          Dropdown: {
            paddingBlock: "5px",
          },
        },
      }}
    >
      <Flex
        align="center"
        justify="between"
        className="w-full min-h-[85px] px-4 py-2 shadow-sm overflow-auto text-slate-700 bg-white"
      >
        <div>
          <CgMenu
            size={40}
            onClick={toggleSidebar}
            className="cursor-pointer text-abbes"
          />
        </div>

        <Flex align="center" gap={30} justify="flex-end" className="w-full">
          {/* Notification Badge */}
          <div className="w-8 h-8 bg-[#faede3] flex items-center justify-center p-6 rounded-md relative">
            <Link to="/notification" className="flex">
              <FaRegBell color="#fd7d00" size={30} className="relative" />
              <Badge dot className="absolute top-[30%] left-[55%]" />
            </Link>
          </div>

          {/* User Profile */}
          <Popover
            content={userMenuContent}
            trigger="click"
            arrow={false}
            placement="bottomLeft"
          >
            <Avatar
              shape="circle"
              size={44}
              className="rounded-full cursor-pointer ring-2 ring-offset-2 ring-abbes"
              src={`${getImageUrl}${user?.image}`}
            />
          </Popover>
        </Flex>
      </Flex>
    </ConfigProvider>
  );
};

export default Header;
