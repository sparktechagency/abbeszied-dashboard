import React, { useState } from "react";
import { Table, Avatar, ConfigProvider, Input, Button } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoEye } from "react-icons/io5";
import man from "../../../assets/man.png";
import GetPageName from "../../../components/common/GetPageName";
import dayjs from "dayjs";
// UserAvatar Component
const UserAvatar = () => (
  <div className="flex gap-2 items-center">
    <Avatar
      shape="circle"
      size={40}
      src={man}
      className="border border-abbes"
    />
    <p>John Doe</p>
  </div>
);

// Sample Data
const initialData = [
  {
    key: 1,
    date: "2021-09-01",
    customername: "",
    name: "John Lennon",
    bookingID: "#1214454",
    ammount: 5,
    status: "Sent",
  },
  {
    key: 2,
    date: "2021-10-15",
    customername: "",
    name: "Paul McCartney",
    bookingID: "#121idj54",
    ammount: 10,
    status: "Pending",
  },
  {
    key: 3,
    date: "2021-10-15",
    customername: "",
    name: "George Harrison",
    bookingID: "#1256789",
    ammount: 15,
    status: "Pending",
  },
  {
    key: 4,
    date: "2021-11-20",
    customername: "",
    name: "Ringo Starr",
    bookingID: "#1239874",
    ammount: 20,
    status: "Sent",
  },
  {
    key: 5,
    date: "2021-11-20",
    customername: "",
    name: "Ringo Starr",
    bookingID: "#1239874",
    ammount: 20,
    status: "Unpaid",
  },
];

function Transaction() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState(initialData);

  // Handle search input change
  const handleSearch = (value) => setSearchQuery(value);

  // Filter data based on search query
  const filteredData = data.filter(({ customername, ...transaction }) =>
    Object.entries(transaction).some(([key, value]) => {
      if (key === "date") {
        return new Date(value).toLocaleDateString().includes(searchQuery);
      }
      if (key === "ammount") {
        return value.toString().includes(searchQuery);
      }
      return (
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
  );
  // Handle row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  // Handle delete function
  const handleDelete = () => {
    // Delete only the selected rows
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
  };

  // Columns Definition
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => <p>{dayjs(date).format("DD MMM YY")}</p>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => <UserAvatar user={name} />,
    },
    {
      title: "Bookinng ID",
      dataIndex: "bookingID",
      key: "bookingID",
    },
    {
      title: "Ammount",
      dataIndex: "ammount",
      key: "ammount",
      // defaultSortOrder: "descend",
      sorter: (a, b) => a.ammount - b.ammount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <p
          className={`${
            status.charAt(0).toLocaleUpperCase() ===
            "Sent".charAt(0).toLocaleUpperCase()
              ? "text-green-500 bg-green-50 border border-green-500 w-20 px-1.5 py-0.5 rounded-lg"
              : status.charAt(0).toUpperCase() ===
                "Paid".charAt(0).toLocaleUpperCase()
              ? "text-sky-500 bg-sky-50 border border-sky-500 w-20 px-1.5 py-0.5 rounded-lg"
              : "text-red-500 bg-red-50 border border-red-500 w-20 px-1.5 py-0.5 rounded-lg"
          } `}
        >
          {status}
        </p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <IoEye
            style={{ fontSize: 24 }}
            className="text-black hover:text-abbes cursor-pointer"
          />
          <RiDeleteBin6Line
            style={{ fontSize: 24 }}
            className="text-black hover:text-red-500 cursor-pointer"
            onClick={() =>
              setData(data.filter((item) => item.key !== record.key))
            }
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
            // itemBg: "#000000",
          },

          Button: {
            defaultHoverBg: "#18a0fb ",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#18a0fb ",
          },
        },
      }}
    >
      <Head
        onSearch={handleSearch}
        pagename="Transactions"
        selectedRowKeys={selectedRowKeys}
        handleDelete={handleDelete}
        filteredData={filteredData}
      />

      <Table
        columns={columns}
        rowSelection={rowSelection}
        dataSource={filteredData}
        pagination={{
          defaultPageSize: 5,
          position: ["bottomRight"],
          size: "default",
          total: 50,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        showSorterTooltip={{
          target: "sorter-icon",
        }}
      />
    </ConfigProvider>
  );
}

export default Transaction;

// Head Component (for Search Bar and Delete Button)
function Head({ onSearch, selectedRowKeys, handleDelete, filteredData }) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
            // itemBg: "#000000",
          },

          Button: {
            defaultHoverBg: "#18a0fb ",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#18a0fb ",
          },
        },
      }}
    >
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>

        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search by Recipient, Ocation, Price, or Status"
            onChange={(e) => onSearch(e.target.value)}
            prefix={<SearchOutlined />}
            // style={{ width: 200, height: 41 }}
            className="h-9 gap-2"
            allowClear
          />

          {/* Show delete button only if more than one row is selected */}

          {selectedRowKeys.length > 1 && (
            <Button
              onClick={handleDelete}
              icon={<DeleteOutlined />}
              className="bg-[#18a0fb] text-white border-none h-9"
            >
              {selectedRowKeys.length === filteredData.length
                ? "Delete All"
                : "Delete Selected"}
            </Button>
          )}
        </div>
      </div>
    </ConfigProvider>
  );
}
