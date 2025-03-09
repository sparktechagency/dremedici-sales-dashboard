import React, { useState } from "react";
import { Modal, Button, Select } from "antd";

const StatusUpdateModal = ({ isVisible, onClose, orderData, onUpdateStatus }) => {
  const [status, setStatus] = useState(orderData?.status || "Pending");

  return (
    <Modal
      title={`Update Status - ${orderData?.orderId}`}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          className="bg-gradient-to-r from-primary to-secondary"
          onClick={() => onUpdateStatus(status)}
        >
          Confirm
        </Button>,
      ]}
    >
      <Select
        value={status}
        onChange={setStatus}
        className="w-full mb-6"
        options={[
          { value: "Pending", label: "Pending" },
          { value: "Processing", label: "Processing" },
          { value: "Cancelling", label: "Cancelling" },
          { value: "Shipped", label: "Shipped" },
          { value: "Delivered", label: "Delivered" },
        ]}
      />
    </Modal>
  );
};

// ✅ Export the component
export default StatusUpdateModal;
