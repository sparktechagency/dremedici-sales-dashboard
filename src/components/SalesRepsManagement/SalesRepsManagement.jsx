import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import { SyncOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetRetailerByIdQuery,
  useGetRetailersQuery,
} from "../../redux/apiSlices/myRetailerApi";

const SalesRepsManagementTable = () => {
  const { data: retailer } = useGetRetailersQuery();
  const retailerData = retailer?.data;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    salesRep: "",
    targetAmount: "",
  });

  // Delete confirmation modal
  const showDeleteConfirm = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = () => {
    // In a real app, you would call an API to delete the retailer
    setIsDeleteModalVisible(false);
    message.success("Retailer deleted successfully");
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  const handleClose = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Selected Sales Rep:", formData.salesRep);
    console.log("Target Amount:", formData.targetAmount);
    handleClose();
  };

  const handleStatusCancel = () => {
    setIsStatusModalVisible(false);
    form.resetFields();
  };

  const handleStatusUpdate = (values) => {
    // In a real app, you would call an API to update the status
    handleStatusCancel();
    message.success("Status updated successfully");
  };

  const showModal = (record = null) => {
    setEditingId(record ? record._id : null);
    form.setFieldsValue(
      record || {
        name: "",
        email: "",
        retailer: "",
        sales: "",
        commission: "",
        status: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values) => {
    // In a real app, you would call an API to save the retailer
    handleCancel();
    message.success(
      editingId
        ? "Retailer updated successfully"
        : "Retailer added successfully"
    );
  };

  const handleViewDetails = (record) => {
    navigate(`/retailer/${record._id}`, { state: record });
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: "Retailer Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Assigned Retailers",
      dataIndex: "assignedRetailers",
      key: "assignedRetailers",
      align: "center",
      render: (assignedRetailers) =>
        Array.isArray(assignedRetailers) ? assignedRetailers.length : 0,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleViewDetails(record)}
            className="cursor-pointer border border-primary px-2 py-1.5 rounded-md hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </button>
        </div>
      ),
    },
  ];

  // Calculate pagination
  const paginatedData = retailerData
    ? retailerData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Assign Retailer</h1>
        </div>
        {/* <div className="flex gap-5 items-center">
          <div>
            <Modal
              title="Assign Target to Sales Rep"
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleClose}
              okText="Submit"
              cancelText="Cancel"
            >
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Set Sales Reps
                </label>
                <select
                  name="salesRep"
                  value={formData.salesRep}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Sales Rep</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mark Johnson">Mark Johnson</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter target amount"
                />
              </div>
            </Modal>
          </div>
          <Button
            type="primary"
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-primary to-secondary h-10 font-bold flex items-center"
          >
            Assign Target
          </Button>
        </div> */}
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary pt-6 px-6 rounded-xl">
        <Table
          dataSource={retailerData || []}
          columns={columns}
          rowKey="_id"
          bordered={false}
          size="small"
          rowClassName="custom-row"
          loading={!retailerData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: retailerData?.length || 0,
            onChange: handlePageChange,
            showSizeChanger: false, // Optional
          }}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingId ? "Edit Sales Rep" : "Add Sales Rep"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingId ? "Save Changes" : "Add Sales Rep"}
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #4E9DAB, #336C79)",
            border: "none",
            color: "white",
          },
        }}
        cancelButtonProps={{
          style: {
            background: "#D32F2F",
            border: "none",
            color: "white",
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Sales Rep Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Assigned Retailer"
            name="retailer"
            rules={[{ required: true, message: "Please enter retailer count" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Total Sales"
            name="sales"
            rules={[{ required: true, message: "Please enter total sales" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Commission"
            name="commission"
            rules={[{ required: true, message: "Please enter commission" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please enter status" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        title="Update Status"
        open={isStatusModalVisible}
        onCancel={handleStatusCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleStatusUpdate}>
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Select placeholder="Select status">
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<SyncOutlined />}
            className="bg-gradient-to-r from-primary to-secondary h-10 font-bold"
          >
            Update
          </Button>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Delete"
        open={isDeleteModalVisible}
        onOk={handleDelete}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          type: "primary",
        }}
      >
        <p>Are you sure you want to delete {recordToDelete?.name}?</p>
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default SalesRepsManagementTable;
