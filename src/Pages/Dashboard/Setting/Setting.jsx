import React from "react";
import { Tabs, ConfigProvider, Radio } from "antd";
import AdminList from "./AdminList";
import AdminPassword from "./AdminPassword";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "admin",
    label: "Admin",
    children: <AdminList />,
  },
  {
    key: "password",
    label: "Password",
    children: <AdminPassword />,
  },
];
function Setting() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            cardBg: "none",
            border: "none",
            inkBarColor: "#fd7d00",
            itemHoverColor: "black",
            itemSelectedColor: "#fd7d00",
            titleFontSize: "18px",
            horizontalMargin: "0 0 30px 0",
          },
        },
      }}
    >
      <Tabs
        defaultActiveKey="1"
        type="card"
        items={items}
        onChange={onChange}
        className="py-8 font-medium "
      />
    </ConfigProvider>
  );
}

export default Setting;
