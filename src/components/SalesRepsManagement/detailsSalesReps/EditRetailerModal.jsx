import React, { useEffect } from "react";
import { Modal, Button, Input, Form, Row, Col, Space, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useGetRetailerDetailsInfoQuery, useUpdateRetailerInfoMutation } from "../../../redux/apiSlices/myRetailerApi";
import { useParams } from "react-router-dom";

const EditRetailerModal = ({ isVisible, onClose,  }) => {
  const [form] = Form.useForm();
  const {id}=useParams()
  const [updateRetailerInfo, { isLoading }] = useUpdateRetailerInfoMutation();
    const { data,  } = useGetRetailerDetailsInfoQuery(id);
    const initialData = data?.data;

  // Prefill form on modal open or initialData change
  useEffect(() => {
    if (isVisible && initialData) {
      form.setFieldsValue({
        name: initialData?.retailerInfo?.name,
        email: initialData?.retailerInfo?.email,
        phone: initialData?.retailerInfo?.phone,
        shippingAddress: initialData?.retailerInfo?.address,
        nameOnCard: initialData.card?.cardHolderName,
        cardNumber: initialData.card?.cardNumber,
        expiry: initialData.card?.expiryDate,
        cvc: initialData.card?.cvv,
        zipCode: initialData.card?.zipCode,
      });
    }
  }, [isVisible, initialData, form]);

  const handleFinish = async (values) => {
    try {
      // Prepare payload as required by API
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.shippingAddress,
        card: {
          cardHolderName: values.nameOnCard,
          cardNumber: values.cardNumber,
          expiryDate: values.expiry,
          cvv: values.cvc,
          zipCode: values.zipCode,
        },
      };
      await updateRetailerInfo({ id, data:payload }).unwrap();

      message.success("Retailer updated successfully");
      onClose();
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Update failed");
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Edit Retailer Information"
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={isLoading}
        >
          Save Changes
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Retailer Name"
              name="name"
              rules={[
                { required: true, message: "Please enter retailer name" },
              ]}
            >
              <Input className="p-2 rounded" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email address" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input className="p-2 rounded" />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input className="p-2 rounded" />
            </Form.Item>

            <Form.Item
              label="Shipping Address"
              name="shippingAddress"
              rules={[
                { required: true, message: "Please enter shipping address" },
              ]}
            >
              <Input.TextArea className="p-2 rounded" rows={3} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <h2 className="text-lg font-medium mb-4">Payment Information</h2>

            <Form.Item
              name="nameOnCard"
              label="Name on Card"
              rules={[{ required: true, message: "Please enter name on card" }]}
            >
              <Input className="p-2 rounded mb-3" />
            </Form.Item>

            <Form.Item
              name="cardNumber"
              label="Card Number"
              rules={[
                { required: true, message: "Please enter card number" },
                {
                  pattern: /^[0-9 ]{13,19}$/,
                  message: "Please enter a valid card number",
                },
              ]}
            >
              <Input
                className="p-2 rounded mb-3"
                maxLength={19}
                placeholder="1234 5678 9876 5432"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="expiry"
                  label="Expiry Date"
                  rules={[
                    { required: true, message: "Expiry date is required" },
                    {
                      pattern: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                      message: "Format: MM/YY",
                    },
                  ]}
                >
                  <Input placeholder="MM/YY" className="p-2 rounded mb-3" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="cvc"
                  label="CVC"
                  rules={[
                    { required: true, message: "CVC is required" },
                    { pattern: /^[0-9]{3,4}$/, message: "Invalid CVC" },
                  ]}
                >
                  <Input
                    className="p-2 rounded mb-3"
                    maxLength={4}
                    suffix={<LockOutlined className="text-gray-400" />}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[
                { required: true, message: "Please enter zip code" },
                {
                  pattern: /^[0-9]{5}(-[0-9]{4})?$/,
                  message: "Please enter a valid zip code",
                },
              ]}
            >
              <Input className="p-2 rounded" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditRetailerModal;
