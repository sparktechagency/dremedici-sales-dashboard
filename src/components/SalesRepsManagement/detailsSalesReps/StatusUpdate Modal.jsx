import { useState } from "react";
import { Modal, Button, Select } from "antd";

const StatusUpdateModal = ({ isOpen, onClose, record, onUpdateStatus }) => {
  const [status, setStatus] = useState(record?.status || "inactive");

  return (
    <Modal
      title="Update Status"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={() => onUpdateStatus(record.id, status)}
        >
          Update
        </Button>,
      ]}
    >
      <Select value={status} onChange={setStatus} style={{ width: "100%" }}>
        <Select.Option value="active">Active</Select.Option>
        <Select.Option value="inactive">Inactive</Select.Option>
      </Select>
    </Modal>
  );
};
