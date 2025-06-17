import React from "react";
import { Modal, Button, Form, Input, Space, Row, Col, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useCreateRetailerMutation, useUpdateRetailerInfoMutation } from "../../redux/apiSlices/myRetailerApi";
import { useProfileQuery } from "../../redux/apiSlices/authSlice";
// import { useGetSalesRepsQuery } from "../../redux/apiSlices/salesRepManagement";

const AddRetailerModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedUser,
  setSelectedUser,
  refetchData,
}) => {
  const [form] = Form.useForm();
  const [createRetailer, { isLoading: isCreating }] =
    useCreateRetailerMutation();
  const [updateRetailer, { isLoading: isUpdating }] =
        useUpdateRetailerInfoMutation();
    const { data } = useProfileQuery()
   
    const salesRepId = data?.data?._id
    console.log(salesRepId)
//   const { data: sales } = useGetSalesRepsQuery();
//   const salesData = sales?.data || [];

  const isEditing = !!selectedUser;
  const isLoading = isCreating || isUpdating;

  React.useEffect(() => {
    if (selectedUser) {
      // Populate form with existing data for editing
      form.setFieldsValue({
        name: selectedUser.name,
        email: selectedUser.email,
        shippingAddress: selectedUser.address || selectedUser.shippingAddress,
        nameOnCard:
          selectedUser.card?.cardHolderName || selectedUser.card?.nameOnCard,
        cardNumber: selectedUser.card?.cardNumber,
        expiry: selectedUser.card?.expiryDate || selectedUser.card?.expiry,
        cvc: selectedUser.card?.cvv || selectedUser.card?.cvc,
        zipCode: selectedUser.card?.zipCode,
      });
    } else {
      form.resetFields();
    }
  }, [selectedUser, form]);

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const onFinish = async (values) => {
    try {
      const retailerData = {
        name: values.name,
        email: values.email,
          address: values.shippingAddress,
        salesRepId,
        card: {
          cardHolderName: values.nameOnCard,
          cardNumber: values.cardNumber,
          expiryDate: values.expiry,
          cvv: values.cvc,
          zipCode: values.zipCode,
        },
      };

      let response;

      if (isEditing) {
        // Update existing retailer
        response = await updateRetailer({
          id: selectedUser._id,
          ...retailerData,
        }).unwrap();
      } else {
        // Create new retailer
        response = await createRetailer(retailerData).unwrap();
      }

      if (response && response.success) {
        message.success(
          isEditing
            ? "Retailer updated successfully"
            : "Retailer added successfully"
        );
        setIsModalOpen(false);
        setSelectedUser(null);
        form.resetFields();

        // Refresh the data
        if (typeof refetchData === "function") {
          refetchData();
        }
      } else {
        const errorMsg =
          response?.message ||
          `Failed to ${isEditing ? "update" : "add"} retailer`;
        message.error(errorMsg);
      }
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "adding"} retailer:`,
        error
      );
      const errorMsg =
        error?.data?.message ||
        error?.message ||
        `Failed to ${isEditing ? "update" : "add"} retailer`;
      message.error(errorMsg);
    }
  };

  const formatCardNumber = (value) => {
    if (!value) return value;
    const cleanValue = value.replace(/\D/g, "");
    const formattedValue = cleanValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formattedValue;
  };

  const formatExpiry = (value) => {
    if (!value) return value;
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + "/" + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  return (
    <Modal
      title={isEditing ? "Edit Retailer" : "Add New Retailer"}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
      styles={{
        header: {
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
          padding: "16px 24px",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Row gutter={32}>
          {/* Left Column - Basic Information */}
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  <span style={{ color: "#ff4d4f" }}>*</span> Retailer Name
                </span>
              }
              name="name"
              rules={[
                { required: true, message: "Please enter retailer name" },
              ]}
              style={{ marginBottom: "20px" }}
            >
              <Input
                placeholder="Name"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  <span style={{ color: "#ff4d4f" }}>*</span> Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter email address" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
              style={{ marginBottom: "20px" }}
            >
              <Input
                placeholder="Email"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                  fontSize: "14px",
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  <span style={{ color: "#ff4d4f" }}>*</span> Shipping Address
                </span>
              }
              name="shippingAddress"
              rules={[
                { required: true, message: "Please enter shipping address" },
              ]}
              style={{ marginBottom: "20px" }}
            >
              <Input.TextArea
                placeholder="Shipping address"
                rows={4}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #d9d9d9",
                  fontSize: "14px",
                  resize: "none",
                }}
              />
            </Form.Item>
          </Col>

          {/* Right Column - Payment Information */}
          <Col xs={24} md={12}>
            <div style={{ marginBottom: "16px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#262626",
                  margin: "0 0 20px 0",
                }}
              >
                Payment Information
              </h3>

              <Form.Item
                name="nameOnCard"
                rules={[
                  { required: true, message: "Please enter name on card" },
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input
                  placeholder="Name On Card"
                  style={{
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="cardNumber"
                rules={[
                  { required: true, message: "Please enter card number" },
                ]}
                style={{ marginBottom: "16px" }}
              >
                <Input
                  placeholder="Card Number"
                  maxLength={23}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    form.setFieldsValue({ cardNumber: formatted });
                  }}
                  style={{
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                  suffix={
                    <Space size={4}>
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: "#ff4d4f",
                        }}
                      />
                      <div
                        style={{
                          width: "12px",
                          height: "8px",
                          backgroundColor: "#faad14",
                          borderRadius: "2px",
                        }}
                      />
                      <div
                        style={{
                          width: "12px",
                          height: "8px",
                          backgroundColor: "#1890ff",
                          borderRadius: "2px",
                        }}
                      />
                    </Space>
                  }
                />
              </Form.Item>

              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    name="expiry"
                    rules={[
                      { required: true, message: "Required" },
                      {
                        pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                        message: "Format: MM/YY",
                      },
                    ]}
                    style={{ marginBottom: "16px" }}
                  >
                    <Input
                      placeholder="mm/yy"
                      maxLength={5}
                      onChange={(e) => {
                        const formatted = formatExpiry(e.target.value);
                        form.setFieldsValue({ expiry: formatted });
                      }}
                      style={{
                        height: "40px",
                        borderRadius: "6px",
                        border: "1px solid #d9d9d9",
                        fontSize: "14px",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="cvc"
                    rules={[
                      { required: true, message: "Required" },
                      { pattern: /^[0-9]{3,4}$/, message: "3-4 digits" },
                    ]}
                    style={{ marginBottom: "16px" }}
                  >
                    <Input
                      placeholder="CVC"
                      maxLength={4}
                      style={{
                        height: "40px",
                        borderRadius: "6px",
                        border: "1px solid #d9d9d9",
                        fontSize: "14px",
                      }}
                      suffix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="zipCode"
                rules={[{ required: true, message: "Please enter ZIP code" }]}
                style={{ marginBottom: "0" }}
              >
                <Input
                  placeholder="Zip Code"
                  style={{
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #d9d9d9",
                    fontSize: "14px",
                  }}
                />
              </Form.Item>
            </div>
          </Col>
        </Row>

        {/* Footer Buttons */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            style={{
              height: "40px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "6px",
              border: "1px solid #d9d9d9",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
            style={{
              height: "40px",
              paddingLeft: "24px",
              paddingRight: "24px",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            {isEditing ? "Update Retailer" : "Add Retailer"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddRetailerModal;
