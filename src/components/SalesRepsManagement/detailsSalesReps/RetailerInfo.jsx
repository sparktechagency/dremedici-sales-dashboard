import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  Form,
  Space,
  Select,
  message,
} from "antd";
import GradientButton from "../../common/GradiantButton";
import DetailsModal from "../../salesMangement/DetailsModal";
import StatusUpdateModal from "../../salesMangement/StatusUpdateModal";

const RetailerInfo = ({ salesRep }) => {
  const [data, setData] = useState([
    {
      key: "1",
      orderId: "ORD001",
      retailerName: "John Doe",
      salesRepName: "Rep 1",
      totalBoxes: 100,
      freeBoxes: 10,
      amount: 500,
      image: "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      status: "pending",
    },
    {
      key: "2",
      orderId: "ORD002",
      retailerName: "Jane Smith",
      salesRepName: "Rep 2",
      totalBoxes: 200,
      freeBoxes: 20,
      amount: 1000,
      image: "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      status: "shipped",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isRetailerModalVisible, setIsRetailerModalVisible] = useState(false);
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);

  const [orders, setOrders] = useState(data); // Ensuring orders is an array

  const handleUpdateStatus = (newStatus) => {
    // Find the order being updated
    const updatedOrder = { ...selectedOrderData, status: newStatus };

    // Update the orders state with the new status for the specific order
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrderData?.orderId ? updatedOrder : order
    );

    // Update the orders state with the modified data
    setOrders(updatedOrders);

    message.success(`Order status updated to "${newStatus}" successfully!`);
    setIsStatusModalVisible(false); // Close status modal
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", align: "center" },
    { title: "Retailer Name", dataIndex: "retailerName", align: "center" },
    { title: "Sales Rep Name", dataIndex: "salesRepName", align: "center" },
    { title: "Total Boxes Ordered", dataIndex: "totalBoxes", align: "center" },
    { title: "Free Boxes", dataIndex: "freeBoxes", align: "center" },
    { title: "Amount", dataIndex: "amount", align: "center" },
    { title: "Status", dataIndex: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <GradientButton
            onClick={() => {
              setSelectedOrderData(record);
              setIsModalDetailsVisible(true);
            }}
          >
            Details
          </GradientButton>
          <GradientButton
            onClick={() => {
              setSelectedOrderData(record);
              setIsStatusModalVisible(true);
            }}
          >
            Status Update
          </GradientButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-10 mt-10">
        <h1 className="text-2xl font-bold">Order List</h1>
        <div className="flex gap-4">
          <GradientButton onClick={() => setIsRetailerModalVisible(true)}>
            Edit profile
          </GradientButton>
        </div>
      </div>

      <div className="px-6 pt-6 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <Table
          dataSource={orders} // Use the 'orders' state here
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          rowClassName="custom-row"
        />
      </div>

      {/* Render the modal with the selected order data */}
      <DetailsModal
        isVisible={isModalDetailsVisible}
        onClose={() => setIsModalDetailsVisible(false)}
        orderData={selectedOrderData}
      />

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        visible={isRetailerModalVisible}
        onCancel={() => setIsRetailerModalVisible(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={{
            retailerName: salesRep?.name || "",
            email: salesRep?.email || "",
            assignReps: salesRep?.assignReps || "",
            status: salesRep?.status || "Active",
          }}
          onFinish={() => {}}
        >
          {/* Retailer Name */}
          <Form.Item
            name="retailerName"
            label="Retailer Name"
            rules={[{ required: true, message: "Please input retailer name!" }]}
          >
            <Input />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>

          {/* Assign Reps Dropdown */}
          <Form.Item
            name="assignReps"
            label="Assign Reps"
            rules={[
              { required: true, message: "Please select an assign rep!" },
            ]}
          >
            <Select>
              <Select.Option value="Rep 1">Rep 1</Select.Option>
              <Select.Option value="Rep 2">Rep 2</Select.Option>
              <Select.Option value="Rep 3">Rep 3</Select.Option>
            </Select>
          </Form.Item>

          {/* Status Dropdown */}
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <GradientButton type="primary" htmlType="submit">
              Save Changes
            </GradientButton>
          </Form.Item>
        </Form>
      </Modal>

      {/* Status Update Modal */}
      {selectedOrderData && (
        <StatusUpdateModal
          isVisible={isStatusModalVisible}
          onClose={() => setIsStatusModalVisible(false)}
          orderData={selectedOrderData}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default RetailerInfo;
