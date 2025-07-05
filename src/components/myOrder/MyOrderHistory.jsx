import React, { useState, useEffect } from "react";
import { Table, Input, Select } from "antd";
import { useGetMyorderHistoryQuery } from "../../redux/apiSlices/myOrderHistoryApi";
import moment from "moment";
import OrderDetailsModal from "./OrdersDetailsModal";

const { Option } = Select;

const MyOrderHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [queryParams, setQueryParams] = useState([]);
  console.log(selectedOrder)

  useEffect(() => {
    const params = [];

    if (searchText) {
      params.push({ name: "searchTerm", value: searchText });
    }

    if (selectedStatus && selectedStatus !== "all") {
      params.push({ name: "orderStatus", value: selectedStatus.toLowerCase() });
    }

    // Add pagination params
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: pageSize });

    setQueryParams(params);
  }, [searchText, selectedStatus, currentPage, pageSize]);

  // Use the query with params
  const { data, isLoading } = useGetMyorderHistoryQuery(queryParams);


  // Safely extract orders and pagination info
  const orders = data?.data || [];
  console.log(orders)
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10 };

  const columns = [
    {
      title: "Invoice#",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
    },
    {
      title: "Retailer Name",
      dataIndex: ["userId", "name"],
      key: "retailerName",
      align: "center",
    },
    {
      title: "Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      align: "center",
      render: (text) => <span>{text ? text.split(" ")[0] : "N/A"}</span>,
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text) => <span>{moment(text).format("L")}</span>,
    },
    {
      title: "Order Quantity",
      dataIndex: "orderBoxs",
      key: "orderBoxs",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      render: (text) => `$${text}`,
    },
    {
      title: "Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <button
          className="px-5 py-2 rounded-md border cursor-pointer border-primary"
          onClick={() => {
            setSelectedOrder(record);
            setModalVisible(true);
          }}
        >
          View Details
        </button>
      ),
    },
  ];

  // Modal close handler
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">Recent Orders</h2>
        <div className="flex space-x-4">
          <Input
            placeholder="Search by Invoice ID or Product Name"
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-64 py-2"
            allowClear
          />
          <Select
            placeholder="Filter by Status"
            onChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1); // reset to first page on filter
            }}
            className="w-64"
            allowClear
            style={{ height: "40px" }}
          >
            <Option value="pending">Pending</Option>
            <Option value="processing">Processing</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            <Option value="canceled">Canceled</Option>
          </Select>
        </div>
      </div>

      <div className="px-6 pt-6 rounded-xl bg-gradient-to-r from-primary to-secondary">
        <Table
          loading={isLoading}
          dataSource={orders}
          columns={columns}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            onChange: handlePageChange,
            showSizeChanger: false,
          }}
          bordered={false}
          size="small"
          rowClassName="custom-table"
        />
      </div>

      {/* Using the OrderDetailsModal component */}
      <OrderDetailsModal
        visible={modalVisible}
        order={selectedOrder}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default MyOrderHistory;
