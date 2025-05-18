import React from "react";
import { Modal, Button, Tag, Skeleton } from "antd";
import { useGetRetailerDetailsInfoQuery } from "../../../redux/apiSlices/myRetailerApi";
import { useParams } from "react-router-dom";
import {
  FaCreditCard,
  FaUser,
  FaStore,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaDollarSign,
  FaShoppingCart,
} from "react-icons/fa";
import moment from "moment/moment";

const RetailerInfoModal = ({ isVisible, onClose }) => {
  const { id } = useParams();
  const { data, isLoading } = useGetRetailerDetailsInfoQuery(id);
  const retailerData = data?.data;

 

  // Format currency values
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <FaStore size={20} />
          <span className="text-xl font-semibold">Retailer Information</span>
        </div>
      }
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 10 }} />
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          {/* Retailer Header */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  {retailerData?.retailerInfo?.name || "Unnamed Retailer"}
                </h2>
                <p className="text-gray-500">
                  ID: {retailerData?.retailerInfo?._id}
                </p>
              </div>
              <Tag
                color={
                  retailerData?.retailerInfo?.status === "active"
                    ? "green"
                    : "red"
                }
                className="px-3 py-1"
              >
                {retailerData?.retailerInfo?.status?.toUpperCase() || "UNKNOWN"}
              </Tag>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Retailer Information */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FaUser size={18} />
                <span>Business Information</span>
              </h3>

              <div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaEnvelope size={14} />
                  <span>Email</span>
                </p>
                <p className="font-medium">
                  {retailerData?.retailerInfo?.email || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaPhone size={14} />
                  <span>Phone</span>
                </p>
                <p className="font-medium">
                  {retailerData?.retailerInfo?.phone || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaHome size={14} />
                  <span>Address</span>
                </p>
                <p className="font-medium">
                  {retailerData?.retailerInfo?.address || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaUser size={14} />
                  <span>Assigned Sales Rep</span>
                </p>
                <p className="font-medium">
                  {retailerData?.retailerInfo?.assignedSalesRep?.name || "None"}
                </p>
                <p className="text-xs text-gray-400">
                  {retailerData?.retailerInfo?.assignedSalesRep?.email || ""}
                </p>
              </div>

              <div className="pt-2">
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <FaShoppingCart size={14} />
                  <span>Order Statistics</span>
                </p>
                <div className="flex justify-between w-full gap-4 mt-1">
                  <div className="bg-blue-50 p-3 rounded-md ">
                    <p className="text-xs text-blue-500">Total Orders</p>
                    <p className="font-bold text-center text-blue-700 text-xl">
                      {retailerData?.totalOrders || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-md ">
                    <p className="text-xs text-green-500">Total Sales</p>
                    <p className="font-bold text-center text-green-700 text-xl">
                      {formatCurrency(retailerData?.totalSales)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Payment Information */}
            <div className="w-full md:w-1/2 space-y-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-primary">
                <FaCreditCard size={18} />
                <span>Payment Information</span>
              </h3>

              <div className="bg-baseBg rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-md text-white mb-4">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs opacity-80">Card Holder</p>
                      <p className="font-bold">
                        {retailerData?.card?.cardHolderName || "N/A"}
                      </p>
                    </div>
                    <FaCreditCard size={24} />
                  </div>
                  <p className="font-mono text-lg mb-4">
                    {retailerData?.card?.cardNumber}
                  </p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-xs opacity-80">Expires</p>
                      <p>{retailerData?.card?.expiryDate || "MM/YY"}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">CVV</p>
                      <p>{retailerData?.card?.cvv}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-80">Zip Code</p>
                      <p>{retailerData?.card?.zipCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RetailerInfoModal;
