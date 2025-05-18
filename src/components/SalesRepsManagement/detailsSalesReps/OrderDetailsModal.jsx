import { Modal, Spin, Table, Badge, Divider, Tag } from "antd";
import React from "react";
import {
  ShoppingCartOutlined,
  UserOutlined,
  GlobalOutlined,
  BoxPlotOutlined,
  DollarOutlined,
  TagOutlined,
  HomeOutlined,
  CalendarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { getImageUrl } from "../../common/imageUrl";
import { MdEmail } from "react-icons/md";

const OrderDetailsModal = ({
  detailModalVisible,
  setDetailModalVisible,
  selectedOrder,
  orderDetails,
}) => {
  // Use orderDetails when available, fall back to selectedOrder
  const displayData = orderDetails || selectedOrder;
  const loading = selectedOrder && !orderDetails;

  // Get order status for styling
  const status =
    displayData?.orderStatus || displayData?.status || "Processing";

  // Status color mapping
  const statusColors = {
    Completed: "success",
    Processing: "processing",
    Pending: "warning",
    Cancelled: "error",
    Delivered: "success",
    Shipped: "cyan",
    Failed: "error",
  };

  const statusColor = statusColors[status] || "default";

  // Products table columns for the modal
  const productColumns = [
    {
      title: "Product ID",
      dataIndex: ["productId"],
      key: "productId",
      align: "center",
      render: (productId) => (
        <span className="font-medium">
          {typeof productId === "object" ? productId.name : productId}
        </span>
      ),
    },
    {
      title: "Image",
      dataIndex: ["productId", "images"],
      key: "image",
      render: (images, record) => {
        const firstImage = images?.[0]; // Get the first image from the array
        return firstImage ? (
          <img
            src={getImageUrl(firstImage)} // Assuming `getImageUrl` generates the correct image URL
            alt="Product"
            style={{ width: 100, height: 50 }}
            className="m-1 mx-auto my-0 rounded-md"
          />
        ) : (
          <div
            style={{
              width: 100,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
            }}
          >
            <ShoppingOutlined
              style={{ fontSize: 24, color: "#d9d9d9" }}
              className="rounded-md"
            />
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: (quantity) => (
        <Tag color="blue" className="px-3 py-1 text-sm rounded-full">
          {quantity}
        </Tag>
      ),
    },
    {
      title: "Price (per unit)",
      dataIndex: "price",
      key: "price",
      render: (price) => <span className="font-medium">${price}</span>,
      align: "center",
    },
    {
      title: "Total",
      dataIndex: "totalAmout",
      key: "totalAmout",
      render: (amount) => (
        <span className="font-semibold text-green-600">${amount}</span>
      ),
      align: "center",
    },
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      centered
      title={
        <div className="flex items-center text-2xl font-bold text-gray-800 py-2">
          <ShoppingCartOutlined className="mr-3 text-blue-600" />
          Order Overview
        </div>
      }
      open={detailModalVisible}
      onCancel={() => setDetailModalVisible(false)}
      width={900}
      footer={null}
      className="order-details-modal"
      bodyStyle={{ padding: "24px", maxHeight: "80vh", overflowY: "auto" }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Spin size="large" tip="Loading order details..." />
        </div>
      ) : (
        displayData && (
          <div className="space-y-8">
            {/* Order Status Banner */}
            <div className="bg-primary text-white rounded-lg p-5 shadow-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg opacity-90">Order ID</h2>
                  <p className="text-2xl font-bold">{displayData.orderId}</p>
                </div>
                <Badge
                  status={statusColor}
                  text={
                    <span className="text-white text-lg font-medium bg-white bg-opacity-20 px-4 py-2 rounded-full">
                      {status}
                    </span>
                  }
                />
              </div>
            </div>

            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Customer Information
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center">
                    <UserOutlined className="text-blue-500 text-lg mr-3" />
                    <div>
                      <p className="text-gray-500 text-sm">Customer Name</p>
                      <p className="text-gray-800 font-medium">
                        {displayData.userId?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <Divider className="my-3" />

                  {displayData.userId?.email && (
                    <>
                      <Divider className="my-3" />
                      <div className="flex items-center">
                        <MdEmail className="text-blue-500 text-lg mr-3" />
                        <div>
                          <p className="text-gray-500 text-sm">
                            Customer Email
                          </p>
                          <p className="text-gray-800 font-medium">
                            {displayData.userId.email}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {displayData.userId?.assignedSalesRep && (
                    <>
                      <Divider className="my-3" />
                      <div className="flex items-center">
                        <UserOutlined className="text-blue-500 text-lg mr-3" />
                        <div>
                          <p className="text-gray-500 text-sm">
                            Sales Representative
                          </p>
                          <p className="text-gray-800 font-medium">
                            {displayData.userId.assignedSalesRep.name}
                          </p>
                          <p className="text-gray-800 font-medium">
                            {displayData.userId.assignedSalesRep.email}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Order Summary
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center">
                    <BoxPlotOutlined className="text-blue-500 text-lg mr-3" />
                    <div>
                      <p className="text-gray-500 text-sm">Total Boxes</p>
                      <p className="text-gray-800 font-medium">
                        {displayData.orderBoxs || "N/A"}
                      </p>
                    </div>
                  </div>

                  <Divider className="my-3" />

                  <div className="flex items-center">
                    <DollarOutlined className="text-blue-500 text-lg mr-3" />
                    <div>
                      <p className="text-gray-500 text-sm">Total Amount</p>
                      <p className="text-green-600 font-semibold text-lg">
                        ${displayData.totalAmount || displayData.amount || "0"}
                      </p>
                    </div>
                  </div>

                  {displayData.commission !== undefined && (
                    <>
                      <Divider className="my-3" />
                      <div className="flex items-center">
                        <DollarOutlined className="text-blue-500 text-lg mr-3" />
                        <div>
                          <p className="text-gray-500 text-sm">Commission</p>
                          <p className="text-gray-800 font-medium">
                            {displayData.commission}%
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700">
                  Shipping Information
                </h3>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <HomeOutlined className="text-blue-500 text-lg mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Shipping Address</p>
                    <p className="text-gray-800 font-medium">
                      {displayData.shippingAddress || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CalendarOutlined className="text-blue-500 text-lg mr-3 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Order Date</p>
                    <p className="text-gray-800 font-medium">
                      {formatDate(displayData.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            {displayData?.products && displayData.products.length > 0 && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-700 flex items-center">
                    <TagOutlined className="text-blue-500 mr-2" />
                    Order Items ({displayData.products.length})
                  </h3>
                </div>
                <div className="p-2">
                  <Table
                    dataSource={displayData.products}
                    columns={productColumns}
                    pagination={false}
                    rowKey={(record, index) => index}
                    className="custom-table"
                    bordered={false}
                    size="small"
                  />
                </div>
              </div>
            )}
          </div>
        )
      )}
    </Modal>
  );
};

export default OrderDetailsModal;
