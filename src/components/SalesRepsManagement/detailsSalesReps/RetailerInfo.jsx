import React, { useState } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  Form,
  Space,
  Select,
  message,
  Row,
  Col,
} from "antd";
import { LockOutlined } from "@ant-design/icons";
import GradientButton from "../../common/GradiantButton";
import DetailsModal from "../../salesMangement/DetailsModal";
import StatusUpdateModal from "../../salesMangement/StatusUpdateModal";

const RetailerInfo = () => {
  // Sample data for orders
  const [orders, setOrders] = useState([
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

  // Sample retailer data
  const [retailerData, setRetailerData] = useState({
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(123) 456-7890",
    salesRep: "Sales Rep 1",
    totalOrder: 24,
    totalSales: "$12,345",
    shippingAddress: "123 Main St, Anytown, USA",
    accountStatus: "Active",
    nameOnCard: "John Doe",
    cardNumber: "4111111111111111",
    expiry: "12/25",
    cvc: "123",
    zipCode: "12345",
    image: "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
  });

  const [form] = Form.useForm();
  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isEditRetailerModalOpen, setIsEditRetailerModalOpen] = useState(false);
  const [isViewRetailerModalOpen, setIsViewRetailerModalOpen] = useState(false);

  const statusOptions = ["Active", "Inactive", "Pending Approval", "Suspended"];

  const handleUpdateStatus = (newStatus) => {
    const updatedOrder = { ...selectedOrderData, status: newStatus };
    const updatedOrders = orders.map((order) =>
      order.orderId === selectedOrderData?.orderId ? updatedOrder : order
    );
    setOrders(updatedOrders);
    message.success(`Order status updated to "${newStatus}" successfully!`);
    setIsStatusModalVisible(false);
  };

  const handleSave = (values) => {
    setRetailerData({ ...retailerData, ...values });
    message.success("Retailer information saved successfully!");
    setIsEditRetailerModalOpen(false);
    form.resetFields();
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
          <button
            className="border border-primary px-2 py-1.5 rounded-md text-sm"
            onClick={() => {
              setSelectedOrderData(record);
              setIsModalDetailsVisible(true);
            }}
          >
            View Details
          </button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-10 mt-10">
        <h1 className="text-2xl font-bold">Order List</h1>
        <div className="flex gap-4">
          <button
            className="border border-primary px-2 py-2 rounded-md"
            onClick={() => {
              form.setFieldsValue(retailerData);
              setIsEditRetailerModalOpen(true);
            }}
          >
            Edit Retailer Information
          </button>
          <GradientButton onClick={() => setIsViewRetailerModalOpen(true)}>
            View Retailer Information
          </GradientButton>
        </div>
      </div>

      <div className="px-6 pt-6 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <Table
          dataSource={orders}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          rowClassName="custom-row"
        />
      </div>

      <DetailsModal
        isVisible={isModalDetailsVisible}
        onClose={() => setIsModalDetailsVisible(false)}
        orderData={selectedOrderData}
      />

      {selectedOrderData && (
        <StatusUpdateModal
          isVisible={isStatusModalVisible}
          onClose={() => setIsStatusModalVisible(false)}
          orderData={selectedOrderData}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Edit Retailer Information Modal */}
      <Modal
        title="Edit Retailer Information"
        visible={isEditRetailerModalOpen}
        onCancel={() => {
          setIsEditRetailerModalOpen(false);
          form.resetFields();
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setIsEditRetailerModalOpen(false);
              form.resetFields();
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Save Changes
          </Button>,
        ]}
        width={800}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Row gutter={24}>
            {/* Left Column */}
            <Col xs={24} md={12}>
              <Form.Item
                label="Retailer Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter retailer name" },
                ]}
              >
                <Input className="p-2 rounded" />
              </Form.Item>

              <Form.Item
                label="Assign Sales Rep"
                name="salesRep"
                rules={[
                  { required: true, message: "Please select a sales rep" },
                ]}
              >
                <Select
                  placeholder="Select Sales Rep Name"
                  className="w-full"
                  suffixIcon={<span className="text-teal-500">▼</span>}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <Select.Option key={i} value={`Sales Rep ${i + 1}`}>
                      Sales Rep {i + 1}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input className="p-2 rounded" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input className="p-2 rounded" />
              </Form.Item>

              <Form.Item
                label="Shipping Address"
                name="shippingAddress"
                rules={[
                  { required: true, message: "Please enter shipping address" },
                ]}
              >
                <Input.TextArea className="p-2 rounded" rows={3} />
              </Form.Item>

              <Form.Item
                label="Account Status"
                name="accountStatus"
                rules={[
                  { required: true, message: "Please select account status" },
                ]}
              >
                <Select placeholder="Select Account Status" className="w-full">
                  {statusOptions.map((status) => (
                    <Select.Option key={status} value={status}>
                      {status}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Right Column - Payment Information */}
            <Col xs={24} md={12}>
              <div className="mb-4">
                <h2 className="text-lg font-medium mb-4">
                  Payment Information
                </h2>

                <Form.Item
                  name="nameOnCard"
                  label="Name on Card"
                  rules={[
                    { required: true, message: "Please enter name on card" },
                  ]}
                >
                  <Input className="p-2 rounded mb-3" />
                </Form.Item>

                <Form.Item
                  name="cardNumber"
                  label="Card Number"
                  rules={[
                    { required: true, message: "Please enter card number" },
                    {
                      pattern: /^[0-9]{13,19}$/,
                      message: "Please enter a valid card number",
                    },
                  ]}
                >
                  <Input
                    className="p-2 rounded mb-3"
                    suffix={
                      <Space>
                        <span className="text-red-500">●</span>
                        <span className="text-gray-900 bg-yellow-500 px-1 rounded">
                          ■
                        </span>
                        <span className="text-blue-500">■</span>
                      </Space>
                    }
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="expiry"
                      label="Expiry Date"
                      rules={[
                        { required: true, message: "Required" },
                        {
                          pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: "Format: MM/YY",
                        },
                      ]}
                    >
                      <Input placeholder="MM/YY" className="p-2 rounded mb-3" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="cvc"
                      label="CVC"
                      rules={[
                        { required: true, message: "Required" },
                        { pattern: /^[0-9]{3,4}$/, message: "Invalid CVC" },
                      ]}
                    >
                      <Input
                        className="p-2 rounded mb-3"
                        suffix={<LockOutlined className="text-gray-400" />}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="zipCode"
                  label="Zip Code"
                  rules={[
                    { required: true, message: "Please enter zip code" },
                    {
                      pattern: /^[0-9]{5}(-[0-9]{4})?$/,
                      message: "Please enter a valid zip code",
                    },
                  ]}
                >
                  <Input className="p-2 rounded" />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* View Retailer Information Modal */}
      <Modal
        title="View Retailer Information"
        visible={isViewRetailerModalOpen}
        onCancel={() => setIsViewRetailerModalOpen(false)}
        footer={[
          <Button
            key="done"
            type="primary"
            onClick={() => setIsViewRetailerModalOpen(false)}
            className="bg-teal-500 hover:bg-teal-600"
          >
            Done
          </Button>,
        ]}
        width={800}
      >
        <div className="bg-gray-50 p-6 rounded-md">
          {/* <div className="flex items-center mb-6">
            <img
              src={retailerData.image}
              alt={retailerData.name}
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold">{retailerData.name}</h2>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  retailerData.accountStatus === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {retailerData.accountStatus}
              </span>
            </div>
          </div> */}

          <div className="flex gap-8">
            {/* Left side - Retail Information */}
            <div className="w-1/2 space-y-4">
              <h3 className="font-bold text-lg mb-3">Retail Information</h3>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{retailerData.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                <p className="font-medium">{retailerData.phone}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Assigned Sales Rep</p>
                <p className="font-medium">{retailerData.salesRep}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="font-medium">{retailerData.totalOrder}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Total Sales</p>
                <p className="font-medium">{retailerData.totalSales}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Shipping Address</p>
                <p className="font-medium">{retailerData.shippingAddress}</p>
              </div>
            </div>

            {/* Right side - Payment Information */}
            <div className="w-1/2 space-y-4">
              <h3 className="font-bold text-lg mb-3">Payment Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Name on Card</p>
                  <p className="font-medium">{retailerData.nameOnCard}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Card Number</p>
                  <p className="font-medium">
                    •••• •••• •••• {retailerData.cardNumber.slice(-4)}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Expiry</p>
                    <p className="font-medium">{retailerData.expiry}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">CVC</p>
                    <p className="font-medium">•••</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Zip Code</p>
                  <p className="font-medium">{retailerData.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RetailerInfo;
