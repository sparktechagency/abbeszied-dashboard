import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Table } from "antd";
import products from "../../../assets/products.png";
const Edit = () => {
  return (
    <button className="bg-[#eceffd] text-[#023f86] px-4 py-0.5 rounded-md text-lg font-medium">
      Edit
    </button>
  );
};

export default function ContentsList() {
  const [data, setData] = useState([
    {
      key: "1",
      sno: 1,
      image: products,
      categoryname: "Fruits",
    },
    {
      key: "2",
      sno: 2,
      image: products,
      categoryname: "Fruits",
    },
    {
      key: "3",
      sno: 3,
      image: products,
      categoryname: "Fruits",
    },
  ]);

  // Function to delete a row
  const handleDelete = (key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      render: (sno) => <p className="text-[#929394]"> {sno}</p>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} width={50} height={50} alt="Medical" />
      ),
      width: "200px",
    },
    {
      title: "Category Name",
      dataIndex: "categoryname",
      key: "categoryname",
      render: (categoryname) => (
        <p className="text-[#929394]"> {categoryname}</p>
      ),
    },
    {
      title: "Overview",
      key: "overview",
      render: () => <Edit />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <button onClick={() => handleDelete(record.key)}>
          <RiDeleteBin6Line color="red" size={24} />
        </button>
      ),
    },
  ];

  return (
    <div className="mx-14">
      <Table dataSource={data} columns={columns} pagination={false} />
    </div>
  );
}
