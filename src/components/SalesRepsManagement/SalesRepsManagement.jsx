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
import {
  SyncOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  useGetRetailerByIdQuery,
  useGetRetailersQuery,
  
  useDeleteRetailerMutation,
  useUpdateRetailerInfoMutation,
} from "../../redux/apiSlices/myRetailerApi";
import AddRetailerModal from "./AddRetailerUnderSales";

const SalesRepsManagementTable = () => {
  const { data: retailer, refetch: refetchRetailers } = useGetRetailersQuery();
  const [updateRetailer, { isLoading: isUpdating }] =
    useUpdateRetailerInfoMutation();
  const [deleteRetailer, { isLoading: isDeleting }] =
    useDeleteRetailerMutation();

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
  const [statusForm] = Form.useForm();
  const navigate = useNavigate();

  // Add Retailer Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Delete confirmation modal
  const showDeleteConfirm = (record) => {
    setRecordToDelete(record);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (recordToDelete) {
        await deleteRetailer(recordToDelete._id).unwrap();
        setIsDeleteModalVisible(false);
        setRecordToDelete(null);
        message.success("Retailer deleted successfully");
        refetchRetailers(); // Refresh the data
      }
    } catch (error) {
      console.error("Error deleting retailer:", error);
      message.error("Failed to delete retailer");
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setRecordToDelete(null);
  };

  // Status update functions
  const showStatusModal = (record) => {
    setSelectedRecord(record);
    statusForm.setFieldsValue({ status: record.status });
    setIsStatusModalVisible(true);
  };

  const handleStatusCancel = () => {
    setIsStatusModalVisible(false);
    setSelectedRecord(null);
    statusForm.resetFields();
  };

  const handleStatusUpdate = async (values) => {
    try {
      if (selectedRecord) {
        await updateRetailer({
          id: selectedRecord._id,
          ...selectedRecord,
          status: values.status,
        }).unwrap();

        handleStatusCancel();
        message.success("Status updated successfully");
        refetchRetailers();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status");
    }
  };

  // Edit retailer functions
  const showEditModal = (record = null) => {
    setEditingId(record ? record._id : null);
    if (record) {
      // For editing existing retailer, open the AddRetailerModal with data
      setSelectedUser(record);
      setIsAddModalOpen(true);
    } else {
      // For adding new retailer
      setSelectedUser(null);
      setIsAddModalOpen(true);
    }
  };

  const handleAddRetailerClick = () => {
    setSelectedUser(null);
    setIsAddModalOpen(true);
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
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (address) => address || "N/A",
    },
    {
      title: "Sales Rep",
      dataIndex: "salesRepId",
      key: "salesRepId",
      align: "center",
      render: (salesRepId) => {
        // If salesRepId is an object with name property
        if (typeof salesRepId === "object" && salesRepId?.name) {
          return salesRepId.name;
        }
        // If it's just an ID string
        return salesRepId || "Not Assigned";
      },
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
          {status || "inactive"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Button
            size="small"
            onClick={() => handleViewDetails(record)}
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            View Details
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Edit
          </Button>
          <Button
            size="small"
            icon={<SyncOutlined />}
            onClick={() => showStatusModal(record)}
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            Status
          </Button>
          <Button
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            danger
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Retailer Management</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRetailerClick}
          className="py-5 text-white bg-primary hover:bg-teal-600"
        >
          Add Retailer
        </Button>
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
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>

      {/* Status Update Modal */}
      <Modal
        title="Update Status"
        open={isStatusModalVisible}
        onCancel={handleStatusCancel}
        footer={null}
        width={400}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleStatusUpdate}>
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

          <div className="flex justify-end gap-2">
            <Button onClick={handleStatusCancel}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SyncOutlined />}
              loading={isUpdating}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Update Status
            </Button>
          </div>
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
        confirmLoading={isDeleting}
        okButtonProps={{
          danger: true,
          type: "primary",
        }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{recordToDelete?.name}</strong>?
        </p>
        <p>This action cannot be undone.</p>
      </Modal>

      {/* Add/Edit Retailer Modal */}
      <AddRetailerModal
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        refetchData={refetchRetailers}
      />
    </div>
  );
};

export default SalesRepsManagementTable;
