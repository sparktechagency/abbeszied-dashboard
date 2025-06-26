import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  ConfigProvider,
} from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import GetPageName from "../../../components/common/GetPageName";
import SelectDuration from "../../../components/common/SelectDuration";
import { nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Add the custom parse format plugin to dayjs
dayjs.extend(customParseFormat);
const date = new Date().toLocaleString();

const originData = [
  {
    bookingID: nanoid(),
    customername: "Swapnil Patel",
    coach: "Tanvir Ahmed",
    status: "Completed",
    scheduledTime: date,
    location: "Central Park, NY",
  },
  {
    bookingID: nanoid(),
    customername: "Riya Sharma",
    coach: "David Wilson",
    status: "Pending",
    scheduledTime: date,
    location: "Hyde Park, London",
  },
  {
    bookingID: nanoid(),
    customername: "Amit Kumar",
    coach: "Sophia Lee",
    status: "Cancelled",
    scheduledTime: date,
    location: "Golden Gate Park, SF",
  },
  {
    bookingID: nanoid(),
    customername: "Emily Davis",
    coach: "Michael Brown",
    status: "Completed",
    scheduledTime: date,
    location: "Millennium Park, Chicago",
  },
  {
    bookingID: nanoid(),
    customername: "John Doe",
    coach: "Chris Martin",
    status: "In Progress",
    scheduledTime: date,
    location: "Sydney Olympic Park, AU",
  },
];

// Add keys to the original data
const dataWithKeys = originData.map((item) => ({
  ...item,
  key: item.bookingID,
  // Add a searchable version of the date that includes the formatted date
  searchableTime:
    item.scheduledTime +
    " " +
    dayjs(item.scheduledTime, "D/M/YYYY hh:mm A").format(
      "DD MMM YYYY, hh:mm A"
    ),
}));

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Please Input ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const BookingListTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataWithKeys);
  const [searchText, setSearchText] = useState("");
  const [editingKey, setEditingKey] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey("");

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => item.key === key);
      if (index > -1) {
        const item = newData[index];
        // If scheduled time has changed, update the searchable time as well
        if (row.scheduledTime && row.scheduledTime !== item.scheduledTime) {
          row.searchableTime =
            row.scheduledTime +
            " " +
            dayjs(row.scheduledTime, "M/D/YYYY hh:mm A").format(
              "DD MMM YYYY, hh:mm A"
            );
        }

        newData[index] = { ...item, ...row };
        setData(newData);
      }
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  // Very simple filtering approach that works with the original data
  const filteredData = data.filter((item) => {
    if (!searchText) return true;

    const searchLower = searchText.toLowerCase();

    // Check each value in the item
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    { title: "Booking ID", dataIndex: "bookingID", width: "5%" },
    {
      title: "Customer",
      dataIndex: "customername",
      width: "20%",
      editable: true,
    },
    { title: "Coach", dataIndex: "coach", width: "20%", editable: true },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      editable: true,
      render: (_, record) => {
        return record.status === "Completed" ? (
          <span className="text-green-600">completed</span>
        ) : record.status === "Pending" ? (
          <span className="text-yellow-400">Pending</span>
        ) : record.status === "Cancelled" ? (
          <span className="text-blue-600">Cancelled</span>
        ) : record.status === "In Progress" ? (
          <span className="text-red-600">In Progress</span>
        ) : null;
      },
    },
    {
      title: "Scheduled Time",
      dataIndex: "scheduledTime",
      width: "20%",
      editable: true,
      // render: (scheduledTime) => {
      //   const date = dayjs(scheduledTime, "D/M/YYYY hh:mm A");
      //   if (date.isValid()) {
      //     return <p>{date.format("DD MMM YYYY, hh:mm A")}</p>;
      //   }
      //   return <p>{scheduledTime}</p>;
      // },
      render: (scheduledTime) => {
        const date = dayjs(scheduledTime, "M/D/YYYY hh:mm A"); // Correcting the format
        if (date.isValid()) {
          return <p>{date.format("DD MMM YYYY, hh:mm A")}</p>;
        }
        return <p>{scheduledTime}</p>;
      },
    },
    { title: "Location", dataIndex: "location", width: "25%", editable: true },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
              className="text-[14px] text-blue-600"
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a className="text-[14px] text-blue-600">Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className="flex items-center gap-4 w-36">
            <button
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              className="hover:text-sky-600"
            >
              <FiEdit3 size={20} />
            </button>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => handleDelete(record.key)}
            >
              <button className="hover:text-red-600">
                <RiDeleteBin6Line size={20} />
              </button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) =>
      col.editable
        ? {
            inputType: "text",
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }
        : undefined,
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
            cellFontSize: "16px",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
          },
          Button: {
            defaultHoverBg: "#18a0fb",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#18a0fb",
          },
        },
      }}
    >
      <div className="flex justify-between items-center py-5">
        <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search in all columns"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 200, height: 40 }}
          />
        </div>
      </div>

      <Form form={form} component={false}>
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          components={{ body: { cell: EditableCell } }}
          bordered
          dataSource={filteredData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
            defaultPageSize: 5,
            position: ["bottomRight"],
            size: "default",
            total: 50,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Form>
    </ConfigProvider>
  );
};

export default BookingListTable;
