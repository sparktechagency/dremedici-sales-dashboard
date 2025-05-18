import React, { useState } from "react";
import { Table, Space, message } from "antd";
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import GradientButton from "../../common/GradiantButton";
import DetailsModal from "../../salesMangement/DetailsModal";
import StatusUpdateModal from "../../salesMangement/StatusUpdateModal";
import EditRetailerModal from "./EditRetailerModal";
import RetailerInfoModal from "./RetailerInfoModal";
import { useGetMyRetailerOrderDetailsQuery, useGetRetailerMyOrderQuery } from "../../../redux/apiSlices/myRetailerApi";
import OrderDetailsModal from "./OrderDetailsModal";

const RetailerInfo = () => {
  const navigate = useNavigate();
  const {id}=useParams()
  const { data } = useGetRetailerMyOrderQuery(id)
  const retailerOrder = data?.data 
  console.log(retailerOrder)

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
 

  const [isModalDetailsVisible, setIsModalDetailsVisible] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isEditRetailerModalOpen, setIsEditRetailerModalOpen] = useState(false);
  const [isViewRetailerModalOpen, setIsViewRetailerModalOpen] = useState(false);
   const { data: orderDetails } =
     useGetMyRetailerOrderDetailsQuery(selectedOrderData?._id);
  console.log(orderDetails);
  const retailerData=orderDetails?.data
// console.log(selectedOrderData);
// console.log(selectedOrderData?._id);
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
  };

  const columns = [
    { title: "Order ID", dataIndex: "orderId", align: "center" },
    { title: "Retailer Name", dataIndex: ["userId", "name"], align: "center" },
    { title: "Retailer Email", dataIndex: ["userId", "email"], align: "center" },
    {
      title: "Sales Rep Name",
      dataIndex: ["userId", "assignedSalesRep", "name"],
      align: "center",
    },
    { title: "Total Boxes Ordered", dataIndex: "orderBoxs", align: "center" },
    { title: "Amount", dataIndex: "totalAmount", align: "center" },
    { title: "Status", dataIndex: "orderStatus", align: "center" },
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
        <div className="flex items-center gap-2">
          <MdArrowBackIosNew
            onClick={() => navigate("/retailer")}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>
        <div className="flex gap-4">
          <button
            className="border border-primary px-2 py-2 rounded-md"
            onClick={() => setIsEditRetailerModalOpen(true)}
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
          dataSource={retailerOrder?.orders}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          rowClassName="custom-row"
        />
      </div>

      {/* Details Modal */}
      <OrderDetailsModal
        detailModalVisible={isModalDetailsVisible}
        setDetailModalVisible={setIsModalDetailsVisible}
        selectedOrder={selectedOrderData}
        orderDetails={retailerData}
      />

      {/* Status Update Modal */}
      {selectedOrderData && (
        <StatusUpdateModal
          isVisible={isStatusModalVisible}
          onClose={() => setIsStatusModalVisible(false)}
          orderData={selectedOrderData}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* Edit Retailer Information Modal */}
      <EditRetailerModal
        isVisible={isEditRetailerModalOpen}
        onClose={() => setIsEditRetailerModalOpen(false)}
        onSave={handleSave}
        initialData={retailerData}
      />

      {/* View Retailer Information Modal */}
      <RetailerInfoModal
        isVisible={isViewRetailerModalOpen}
        onClose={() => setIsViewRetailerModalOpen(false)}
        retailerData={retailerData}
      />
    </div>
  );
};

export default RetailerInfo;
