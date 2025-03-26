import {
  FaGoogleScholar,
  FaPersonDotsFromLine,
  FaPersonWalkingLuggage,
  FaQuoteRight,
} from "react-icons/fa6";
import { CgTemplate } from "react-icons/cg";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { TbBellBolt, TbPackages } from "react-icons/tb";
import { HiOutlineUsers } from "react-icons/hi";
import { RxDashboard } from "react-icons/rx";
import {
  PiCertificateBold,
  PiListBulletsBold,
  PiMessengerLogoBold,
  PiWallet,
} from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { RiContactsBook3Line, RiSettings5Line } from "react-icons/ri";
import logo from "../../assets/logo.png";
import minilogo from "../../assets/minilogo.png";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaBuffer } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { TfiLayoutSlider, TfiLayoutSliderAlt } from "react-icons/tfi";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <RxDashboard size={24} />,
      label: <Link to="/">Overview</Link>,
    },
    {
      key: "/booking-list",
      icon: <LuClipboardList size={25} />,
      label: isCollapsed ? (
        <Link to="/booking-list ">Bookings</Link>
      ) : (
        <Link to="/booking-list">Bookings</Link>
      ),
    },
    {
      key: "subMenuSetting2",
      icon: <HiOutlineUsers size={24} className="text-white" />,
      label: "User",
      children: [
        {
          key: "/trainee-list",
          icon: <FaPersonDotsFromLine size={23} />,
          label: isCollapsed ? (
            <Link to="/trainee-list">Trainee</Link>
          ) : (
            <Link to="/trainee-list">Trainee</Link>
          ),
        },
        {
          key: "/coach-list",
          icon: <FaPersonWalkingLuggage size={24} />,
          label: isCollapsed ? (
            <Link to="/coach-list">Coach</Link>
          ) : (
            <Link to="/coach-list">Coach</Link>
          ),
        },
        {
          key: "/corporate-list",
          icon: <FaGoogleScholar size={24} />,
          label: isCollapsed ? (
            <Link to="/corporate-list">Corporate</Link>
          ) : (
            <Link to="/corporate-list">Corporate</Link>
          ),
        },
      ],
    },
    {
      key: "/pending-products",
      icon: <FaBuffer size={25} />,
      label: isCollapsed ? (
        <Link to="/pending-products">Pending Products</Link>
      ) : (
        <Link to="/pending-products">Pending Products</Link>
      ),
    },
    {
      key: "/product-list",
      icon: <TbPackages size={25} />,
      label: isCollapsed ? (
        <Link to="/product-list">Product Lists</Link>
      ) : (
        <Link to="/product-list">Product List</Link>
      ),
    },
    {
      key: "/certificate-review",
      icon: <PiCertificateBold size={25} />,
      label: isCollapsed ? (
        <Link to="/certificate-review">Certificate Review</Link>
      ) : (
        <Link to="/certificate-review">Certificate Review</Link>
      ),
    },
    {
      key: "/transaction",
      icon: <PiWallet size={25} />,
      label: isCollapsed ? (
        <Link to="/transaction">Transaction</Link>
      ) : (
        <Link to="/transaction">Transaction</Link>
      ),
    },
    {
      key: "/category",
      icon: <PiListBulletsBold size={25} />,
      label: isCollapsed ? (
        <Link to="/category">category</Link>
      ) : (
        <Link to="/category">category</Link>
      ),
    },
    {
      key: "/support-chat",
      icon: <PiMessengerLogoBold size={24} />,
      label: <Link to="/support-chat">Support Chat</Link>,
    },
    {
      key: "/pushnotification",
      icon: <TbBellBolt size={24} />,
      label: <Link to="/pushnotification">PushNotification</Link>,
    },
    {
      key: "subMenuSetting",
      icon: <CgTemplate size={24} />,
      label: "Cms",
      children: [
        {
          key: "/privacy-policy",

          icon: <MdOutlinePrivacyTip size={24} />,
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
        {
          key: "/terms-and-conditions",
          icon: <IoDocumentTextOutline size={24} />,
          label: (
            <Link
              to="/terms-and-conditions"
              className="text-white hover:text-white"
            >
              Terms And Condition
            </Link>
          ),
        },
        {
          key: "/faq",
          icon: <FaQuoteRight size={24} />,
          label: (
            <Link to="/faq" className="text-white hover:text-white">
              FAQ
            </Link>
          ),
        },
        {
          key: "/contact",
          icon: <RiContactsBook3Line size={24} />,
          label: (
            <Link to="/contact" className="text-white hover:text-white">
              Contact Us
            </Link>
          ),
        },
        {
          key: "/about-us",
          icon: <ImProfile size={24} />,
          label: (
            <Link to="/about-us" className="text-white hover:text-white">
              About Us
            </Link>
          ),
        },
        {
          key: "/slider",
          icon: <TfiLayoutSlider size={24} />,
          label: (
            <Link to="/slider" className="text-white hover:text-white">
              Slider
            </Link>
          ),
        },
        {
          key: "/coach-slider",
          icon: <TfiLayoutSliderAlt size={24} />,
          label: (
            <Link to="/coach-slider" className="text-white hover:text-white">
              Coach Slider
            </Link>
          ),
        },
        {
          key: "/corporate-slider",
          icon: <TfiLayoutSliderAlt size={24} />,
          label: (
            <Link
              to="/corporate-slider"
              className="text-white hover:text-white"
            >
              Corporate Slider
            </Link>
          ),
        },
      ],
    },

    {
      key: "/admin-list",
      icon: <RiSettings5Line size={24} />,
      label: isCollapsed ? (
        <Link to="/admin-list">setting</Link>
      ) : (
        <Link to="/admin-list">setting</Link>
      ),
    },
    {
      key: "/logout",
      icon: <FiLogOut size={24} />,
      label: isCollapsed ? null : (
        <Link
          to="/auth/login"
          className="text-white hover:text-white"
          onClick={handleLogout}
        >
          Log Out
        </Link>
      ),
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);
  // useEffect(() => {
  //   setSelectedKey(path);
  // }, [path]);

  return (
    <div
      className={`bg-quilocoP h-full shadow-md transition-all duration-300 ${
        isCollapsed ? "w-[80px]" : "w-[280px]"
      }`}
    >
      <Link
        to="/"
        className="flex items-center justify-center py-4 text-white "
      >
        <div className="w-full flex items-center justify-center bg-quilocoP px-4 py-3 -mt-1.5 gap-3 rounded-lg">
          {/* <TbDashboard size={40} className="text-abbes" /> */}
          {isCollapsed ? (
            <img src={minilogo} />
          ) : (
            // <p className="text-2xl text-abbes font-semibold ">Dashboard</p>
            <img src={logo} />
          )}
          {/* <img src={logo} /> */}
        </div>
      </Link>
      <div
        className=" h-[80%]  overflow-y-auto
  [&::-webkit-scrollbar]:w-0
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ background: "#ffffff" }}
          items={menuItems}
          className="text-white mt-10 "
        />
      </div>
    </div>
  );
};

export default Sidebar;
