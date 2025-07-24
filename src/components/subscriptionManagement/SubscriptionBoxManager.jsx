import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Card, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const SubscriptionBoxManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  // Mock data - replace with actual API calls
  const [subscriptionBoxes, setSubscriptionBoxes] = useState([
    {
      id: 1,
      name: 'Premium Box',
      description: 'Monthly premium subscription box with exclusive products',
      price: 99.99,
      duration: 'monthly',
      status: 'active',
      maxItems: 10,
      category: 'premium',
    },
    {
      id: 2,
      name: 'Basic Box',
      description: 'Basic subscription box with essential products',
      price: 49.99,
      duration: 'monthly',
      status: 'active',
      maxItems: 5,
      category: 'basic',
    },
    {
      id: 3,
      name: 'Seasonal Box',
      description: 'Quarterly seasonal subscription box',
      price: 149.99,
      duration: 'quarterly',
      status: 'inactive',
      maxItems: 15,
      category: 'seasonal',
    },
  ]);

  const showModal = (record = null) => {
    setEditingRecord(record);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (editingRecord) {
        // Update existing subscription box
        setSubscriptionBoxes(prev => 
          prev.map(box => 
            box.id === editingRecord.id ? { ...box, ...values } : box
          )
        );
        message.success('Subscription box updated successfully');
      } else {
        // Add new subscription box
        const newBox = {
          id: Date.now(),
          ...values,
        };
        setSubscriptionBoxes(prev => [...prev, newBox]);
        message.success('Subscription box created successfully');
      }
      handleCancel();
    } catch (error) {
      message.error('Failed to save subscription box');
    }
  };

  const handleDelete = (record) => {
    setSubscriptionBoxes(prev => prev.filter(box => box.id !== record.id));
    message.success('Subscription box deleted successfully');
  };

  const columns = [
    {
      title: 'SL',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Box Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price}`,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Tag color="blue">
          {duration?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color={category === 'premium' ? 'gold' : category === 'basic' ? 'blue' : 'green'}>
          {category?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Max Items',
      dataIndex: 'maxItems',
      key: 'maxItems',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => showModal(record)}
          >
            View
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={() => handleDelete(record)}
          >
            Delete3
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Subscription Box Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Subscription Box
        </Button>
      </div>

      {/* Summary Cards */}
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {subscriptionBoxes.length}
              </div>
              <div className="text-gray-600">Total Boxes</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {subscriptionBoxes.filter(box => box.status === 'active').length}
              </div>
              <div className="text-gray-600">Active Boxes</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {subscriptionBoxes.filter(box => box.status === 'inactive').length}
              </div>
              <div className="text-gray-600">Inactive Boxes</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${subscriptionBoxes.reduce((sum, box) => sum + box.price, 0).toFixed(2)}
              </div>
              <div className="text-gray-600">Total Value</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={subscriptionBoxes}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
      />

      <Modal
        title={editingRecord ? 'Edit Subscription Box' : 'Add Subscription Box'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Box Name"
                rules={[{ required: true, message: 'Please enter box name' }]}
              >
                <Input placeholder="Enter box name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <Input type="number" placeholder="Enter price" prefix="$" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[{ required: true, message: 'Please select duration' }]}
              >
                <Select placeholder="Select duration">
                  <Option value="monthly">Monthly</Option>
                  <Option value="quarterly">Quarterly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="basic">Basic</Option>
                  <Option value="premium">Premium</Option>
                  <Option value="seasonal">Seasonal</Option>
                  <Option value="luxury">Luxury</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxItems"
                label="Max Items"
                rules={[{ required: true, message: 'Please enter max items' }]}
              >
                <Input type="number" placeholder="Enter max items" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionBoxManager;
