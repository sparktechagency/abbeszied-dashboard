import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Button,
} from "antd";
import {
  PlusOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import minilogo from "../../../assets/minilogo.png";

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tableData, setTableData] = useState([
    { key: "1", name: "John Brown", serial: 1, icon: minilogo },
    { key: "2", name: "Jim Green", serial: 2, icon: minilogo },
    { key: "3", name: "Joe Black", serial: 3, icon: minilogo },
    {
      key: "4",
      serial: 4,
      icon: minilogo,
      name: "Mountain Escape",
    },
    {
      key: "5",
      serial: 5,
      icon: minilogo,
      name: "Sunset Glow",
    },
    {
      key: "6",
      serial: 6,
      icon: minilogo,
      name: "City Lights",
    },
  ]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedImage(null);
    setEditingKey(null);
  };

  const handleFormSubmit = (values) => {
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    if (isEditing) {
      // Update existing row
      const updatedData = tableData.map((item) =>
        item.key === editingKey
          ? {
              ...item,
              name: values.name,
              icon: uploadedImage || item.icon,
            }
          : item
      );
      setTableData(updatedData);
      message.success("Category updated successfully!");
    } else {
      // Add new row
      setTableData([
        ...tableData,
        {
          key: (tableData.length + 1).toString(),
          name: values.name,
          serial: tableData.length + 1,
          icon: uploadedImage,
        },
      ]);
      message.success("Category added successfully!");
    }

    handleCancel();
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    setUploadedImage(record.icon);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (key, name) => {
    setDeletingRecord({ key, name });
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    setTableData(tableData.filter((item) => item.key !== deletingRecord.key));
    message.success("Icon deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const onCancelDelete = () => {
    message.info("Delete action canceled.");
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      key: "serial",
      render: (serial) => (
        <p className="font-bold text-black text-[16px]">
          {serial < 10 ? "0" + serial : serial}
        </p>
      ),
    },
    {
      title: "Icon",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => <img width={60} src={icon} alt="Icon" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <FiEdit2
            style={{ fontSize: 24 }}
            className="text-black hover:text-blue-500 cursor-pointer"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            style={{ fontSize: 24 }}
            className="text-black hover:text-red-500 cursor-pointer"
            onClick={() => handleDelete(record.key, record.name)}
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
            cellFontSize: "16px",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
          },
          Button: {
            defaultHoverBg: "fd7d00 ",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "fd7d00 ",
            defaultActiveBg: "fd7d00 ",
            defaultActiveColor: "white",
            defaultActiveBorderColor: "fd7d00",
          },
        },
      }}
    >
      <div>
        <div className="flex justify-between items-center py-5">
          <h1 className="text-[20px] font-medium">Category List</h1>
          <Button
            className="bg-abbes/90 text-white px-4 py-2.5 h-9 rounded-md flex items-center"
            onClick={showModal}
          >
            <PlusOutlined className="mr-2" />
            Add New
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          pagination={{
            defaultPageSize: 5,
            position: ["bottomRight"],
            size: "default",
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          title="Delete Confirmation"
          visible={isDeleteModalOpen}
          onCancel={onCancelDelete}
          footer={null}
          centered
        >
          <div className="flex flex-col justify-between gap-5">
            <div className="flex justify-center">
              Are you sure you want to delete{" "}
              <span className="font-bold ml-1">{deletingRecord?.name}</span>?
            </div>
            <div className="flex justify-center gap-4">
              <ButtonEDU actionType="cancel" onClick={onCancelDelete}>
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="delete" onClick={onConfirmDelete}>
                Delete
              </ButtonEDU>
            </div>
          </div>
        </Modal>

        {/* Modal Form */}
        <Modal
          title={isEditing ? "Edit Category" : "Add Category"}
          open={isModalOpen}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          <ConfigProvider
            theme={{
              components: {
                Form: {
                  labelFontSize: 16,
                },
                Input: {
                  hoverBorderColor: "#fd7d00",
                  activeBorderColor: "#fd7d00",
                },
                token: {
                  colorPrimaryHover: "#fd7d00",
                },
              },
            }}
          >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter the name!" }]}
              >
                <Input placeholder="Enter slider name" className="h-10" />
              </Form.Item>

              <Form.Item label="Upload Image">
                {uploadedImage ? (
                  <div className="relative">
                    <img src={uploadedImage} alt="Uploaded" width={100} />
                    <CloseCircleOutlined
                      className="absolute top-0 right-0 text-red-500 cursor-pointer"
                      onClick={() => setUploadedImage(null)}
                    />
                  </div>
                ) : (
                  <Upload
                    name="image"
                    listType="picture-card"
                    showUploadList={false}
                    onChange={handleImageUpload}
                  >
                    <button style={{ border: 0, background: "none" }}>
                      <CloudUploadOutlined
                        style={{ fontSize: 24 }}
                        className="border rounded-full p-2.5"
                      />
                      <div className="flex flex-col text-[14px]">
                        <sapn>Drop your Icon here or </sapn>
                        <span className="text-abbes"> Click to upload</span>
                      </div>
                    </button>
                  </Upload>
                )}
              </Form.Item>

              <div className="flex justify-end w-full">
                <ButtonEDU actionType="save" className="w-full">
                  Save
                </ButtonEDU>
              </div>
            </Form>
          </ConfigProvider>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

export default Category;
