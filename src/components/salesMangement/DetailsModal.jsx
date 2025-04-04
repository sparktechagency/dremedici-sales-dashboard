import React from "react";
import { Modal } from "antd";

const DetailsModal = ({ isVisible, onClose, orderData }) => {
  return (
    <Modal
    centered
      title={`Order ID: #${orderData?.orderId}`}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <button
          key="back"
          onClick={onClose}
          className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded"
        >
          Back To Order Page
        </button>,
      ]}
      width={700}
    >
      <div className="flex flex-col">
        <div className="flex my-4">
          <div className="w-1/2 border rounded p-4 flex justify-center items-center">
            {orderData?.image ? (
              <img src={orderData.image} alt="Order" className="w-24 h-24" />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center border-2 rounded-lg">
                <span className="text-3xl">😀</span>
              </div>
            )}
          </div>

          <div className="w-1/2 pl-4">
            <div className="mb-2">
              <p className="font-bold">
                Order ID: #{orderData?.orderId || "123456"}
              </p>
            </div>
            <div className="mb-2">
              <p className="font-bold">
                User Name: {orderData?.userName || "Alice Johnson"}
              </p>
            </div>
            <div className="mb-2">
              <p className="font-bold">
                Source: {orderData?.source || "Retailer"}
              </p>
            </div>
            <div className="mb-2">
              <p className="font-bold">
                Order Boxes: {orderData?.orderBox || "20"}
              </p>
            </div>
            <div className="mb-2">
              <p className="font-bold">Price: ${orderData?.amount || "2500"}</p>
            </div>
            <div className="mb-2">
              <p className="font-bold">
                Order Status: {orderData?.status || "Pending"}
              </p>
            </div>
            <div className="mb-2">
              <p className="font-bold">
                Shipping Address:{" "}
                {orderData?.shippingAddress ||
                  "123 Business Avenue, Suite 200 Francisco, CA 94107"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;
