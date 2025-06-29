import React, { useState, useEffect } from "react";
import { Tabs, ConfigProvider, Radio } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";
import Profile from "./Profile";
import { jwtDecode } from "jwt-decode";

function Setting() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Get user role from token when component mounts
    try {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const { role } = jwtDecode(token);

        // Base items that all users can see
        const baseItems = [
          {
            key: "password",
            label: "Password",
            children: <AdminPassword />,
          },
          {
            key: "profile",
            label: "Profile",
            children: <Profile />,
          },
        ];

        // Add admin tab only for super_admin
        if (role === "super_admin") {
          baseItems.unshift({
            key: "admin",
            label: "Admin",
            children: <AdminList />,
          });
        }

        setItems(baseItems);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // Set default items if token decode fails
      setItems([
        {
          key: "password",
          label: "Password",
          children: <AdminPassword />,
        },
        // {
        //   key: "profile",
        //   label: "Profile",
        //   children: <Profile />,
        // },
      ]);
    }
  }, []);

  const onChange = (key) => {
    console.log("Active tab:", key);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            itemActiveColor: "#fd7c04",
            itemSelectedColor: "#fd7c04",
            itemHoverColor: "#fd7c04",
            inkBarColor: "#fd7c04",
          },
        },
      }}
    >
      <Tabs defaultActiveKey="password" items={items} onChange={onChange} />
    </ConfigProvider>
  );
}

export default Setting;
