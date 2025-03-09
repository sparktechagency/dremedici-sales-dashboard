import React, { useState } from "react";
import { Table, Button, Modal, Input, Space, ConfigProvider } from "antd";
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { AddRetailerModal } from "./RetailerModal";
import UpdateModal from "../../components/common/UpdateModal";

// Existing retailersData
const retailersData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Retailer ${i + 1}`,
  email: `retailer${i + 1}@gmail.com`,
  phone: `+23191633389${i + 1}`,
  address: `Address ${i + 1}, City`,
  image: `https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid/50?text=R${
    i + 1
  }`,
}));

const Retailer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [retailers, setRetailers] = useState(retailersData);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Retailer Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            src={record.image}
            alt={record.name}
            className="w-10 h-10 rounded-full mr-3"
          />
          {record.name}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Assigned Sales Rep",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Total Order",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Total Sales",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Account Status",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0090B9", // Sets primary color
                colorPrimaryHover: "#336C79", // Sets hover background color
              },
            }}
          >
            <Button
              onClick={() => handleEdit(record)}
              type="primary"
              size="large"
              className="text-white"
            >
              Edit
            </Button>
          </ConfigProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#FF4D4F", // Change primary color to red for delete
                colorPrimaryHover: "#FF7875", // Sets hover background color for delete
              },
            }}
          >
            <Button
              onClick={() => handleDelete(record.id)}
              type="primary" // Change type to primary for better styling
              danger 
              size="large"
            >
              Delete
            </Button>
          </ConfigProvider>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user); // Set the selected retailer
    setIsUpdateModalOpen(true); // Open the update modal
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setRetailers(retailers.filter((retailer) => retailer.id !== id));
        Swal.fire("Deleted!", "Retailer has been deleted.", "success");
      }
    });
  };

  return (
    <div className="">
      {/* Search and Add Retailer Button */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          type="primary"
          className="bg-gradient-to-r from-primary  to-secondary text-white"
        >
          + Add Retailer
        </Button>
        {isModalOpen && (
          <AddRetailerModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>

      {/* Table */}
      <div className="bg-gradient-to-r from-primary  to-secondary p-6">
        <Table
          dataSource={retailers.filter(
            (retailer) =>
              retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              retailer.email.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="middle"
          rowClassName="custom-row" // Adding custom row class
        />
      </div>

      {/* Update Modal */}
      {isUpdateModalOpen && selectedUser && (
        <UpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={(updatedUserData) => {
            setRetailers(
              retailers.map((retailer) =>
                retailer.id === updatedUserData.id ? updatedUserData : retailer
              )
            );
          }}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default Retailer;
