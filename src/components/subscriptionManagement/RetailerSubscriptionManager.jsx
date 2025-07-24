import React, { useState, useEffect } from 'react';
import { 
  useAddExtraBoxesMutation, 
  useGeAllSubscriptionQuery, 
  useGetAllRetailersQuery, 
  useRetailerSubscribedPackageQuery,
  useUpdateSubscribedPackageMutation, 
  useUpdateSubscriptionMutation
} from '../../redux/apiSlices/retailerManagementApi';
import { useGetProductsQuery } from '../../redux/apiSlices/homeSlice';
import { 
  Table, Button, Modal, Form, Input, Select, DatePicker, 
  Space, Card, Tag, Checkbox, Spin, Alert, Badge, Divider, 
  Typography, Row, Col, message, Descriptions, Statistic, Image
} from 'antd';
import { 
  EditOutlined, ShoppingCartOutlined, ClockCircleOutlined,
  DeleteOutlined, PlusOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const RetailerSubscriptionManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBoxSelectionVisible, setIsBoxSelectionVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [form] = Form.useForm();
  const [boxSelectionForm] = Form.useForm();

  // API calls
  const { data: retailers, isLoading: isRetailersLoading } = useGetAllRetailersQuery();
  const { data: allSubscriptions, isLoading: isSubscriptionsLoading } = useGeAllSubscriptionQuery();
  const { data: products, isLoading: isProductLoading } = useGetProductsQuery();
  const { data: retailerSubscribedPackage, isLoading: isRetailerSubscribedPackageLoading } = useRetailerSubscribedPackageQuery();
  const [updateSubscription, { isLoading: isUpdateLoading }] = useUpdateSubscriptionMutation();
  
  const [addExtraBoxes, { isLoading: isAddExtraBoxesLoading }] = useAddExtraBoxesMutation();
  const [updateSubscribedPackage, { isLoading: isUpdateLoadingPackage }] = useUpdateSubscribedPackageMutation();

  // Data from APIs
  const availableProducts = products?.data || [];
  const retailersList = retailers?.data || [];
  const subscriptionPackages = allSubscriptions?.data || [];
  const subscribedPackages = retailerSubscribedPackage?.data || [];

  console.log(retailersList)
  console.log(retailersList?.activeSubscription?.tier)
  console.log(subscriptionPackages)
  console.log(subscribedPackages)
  console.log(availableProducts)
  

  // Form states
  const [formData, setFormData] = useState({
    userId: '',
    tier: '',
    subscription: '',
    freeShipping: '',
    noCreditCardFee: '',
    exclusiveProducts: '',
    limitedReleases: '',
    termsAndConditionsAccepted: true,
    card: {
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      zipCode: ''
    },
    status: 'running',
    billingDate: new Date().toISOString()
  });
  
  const [boxSelectionData, setBoxSelectionData] = useState({
    selectedBoxes: []
  });
  
  // Function to extract minimum boxes required from tier string
  const getMinimumBoxesRequired = (tierString) => {
    if (!tierString) return 0;
    
    // Extract number before "box" or "boxes"
    const boxMatch = tierString.match(/(\d+)\s*box(?:es)?/i);
    if (boxMatch && boxMatch[1]) {
      return parseInt(boxMatch[1], 10);
    }
    
    return 0;
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if selection window is open (1st to 22nd of every month)
  const isSelectionWindowOpen = () => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    return dayOfMonth >= 1 && dayOfMonth <= 3;
  };

  // Check if edit is allowed (until 25th after selection)
  const isEditAllowed = (subscription) => {
    if (!subscription) return false;
    
    const today = new Date();
    const dayOfMonth = today.getDate();
    return dayOfMonth <= 25;
  };

  // Get time remaining for selection window
  const getSelectionTimeInfo = () => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    if (dayOfMonth >= 1 && dayOfMonth <= 3) {
      const closeDate = new Date(currentYear, currentMonth, 3);
      const timeDiff = closeDate.getTime() - today.getTime();
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      return {
        isOpen: true,
        message: `Window closes in: ${daysLeft}d ${hoursLeft}h`,
        color: 'success'
      };
    } else {
      let nextMonth = currentMonth + 1;
      let nextYear = currentYear;
      
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }
      
      const openDate = new Date(nextYear, nextMonth, 1);
      const timeDiff = openDate.getTime() - today.getTime();
      const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      
      return {
        isOpen: false,
        message: `Next window opens in: ${daysLeft} days`,
        color: 'error'
      };
    }
  };

  const getSelectionStatus = (subscription) => {
    const timeInfo = getSelectionTimeInfo();
    
    if (!subscription) {
      return { status: 'none', color: 'default', text: 'No Subscription' };
    }
    
    if (!timeInfo?.isOpen) {
      return { status: 'closed', color: 'default', text: 'Selection Window Closed' };
    }
    
    if (subscription?.extraBox?.length > 0) {
      return { status: 'completed', color: 'success', text: 'Selection Complete' };
    }
    
    return { status: 'pending', color: 'warning', text: 'Selection Pending' };
  };

  const showModal = (record = null, retailer = null) => {
    if (!record) {
      setIsModalVisible(false);
      return;
    }
    
    setEditingRecord({
      ...record,
      retailerId: retailer?._id // Store retailer ID
    });
    
    // Find the selected subscription package to populate other fields
    const selectedPackage = subscriptionPackages.find(pkg => pkg.tier === record.tier);
    
    const initialValues = {
      userId: record.userId,
      retailerId: retailer?._id, // Add retailer ID to form values
      subscription: record.subscription,
      tier: record.tier,
      freeShipping: selectedPackage?.freeShipping || record.freeShipping,
      noCreditCardFee: selectedPackage?.noCreditCardFee || record.noCreditCardFee,
      exclusiveProducts: selectedPackage?.exclusiveProducts || record.exclusiveProducts,
      limitedReleases: selectedPackage?.limitedReleases || record.limitedReleases,
      termsAndConditionsAccepted: record.termsAndConditionsAccepted || true,
      status: record.status || 'running',
      billingDate: record.billingDate ? moment(record.billingDate) : moment(),
      cardHolderName: record.card?.cardHolderName || '',
      cardNumber: record.card?.cardNumber || '',
      expiryDate: record.card?.expiryDate || '',
      cvv: record.card?.cvv || '',
      zipCode: record.card?.zipCode || ''
    };
    
    form.setFieldsValue(initialValues);
    setFormData({
      ...record,
      retailerId: retailer?._id,
      card: record.card || {
        cardHolderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        zipCode: ''
      }
    });
    
    setIsModalVisible(true);
  };

  const showBoxSelection = (subscription, retailer) => {
    if (!subscription) {
      return;
    }
    
    setSelectedSubscription({
      ...subscription,
      retailerId: retailer?._id // Store retailer ID
    });
    
    const selectedBoxes = subscription?.extraBox?.map(box => {
      const fullProduct = availableProducts.find(p => p._id === box.productId) || {};
      return {
        ...fullProduct,
        ...box
      };
    }) || [];
    
    setBoxSelectionData({
      selectedBoxes: selectedBoxes
    });
    
    boxSelectionForm.setFieldsValue({
      selectedProducts: selectedBoxes.map(box => box._id)
    });
    
    setIsBoxSelectionVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleBoxSelectionCancel = () => {
    setIsBoxSelectionVisible(false);
    setSelectedSubscription(null);
    setBoxSelectionData({ selectedBoxes: [] });
    boxSelectionForm.resetFields();
  };

  // Handle subscription selection and auto-populate fields
  const handleSubscriptionChange = (selectedSubscription) => {
    const selectedPackage = subscriptionPackages.find(pkg => pkg.subscription === selectedSubscription);
    
    if (selectedPackage) {
      form.setFieldsValue({
        tier: selectedPackage.tier,
        freeShipping: selectedPackage.freeShipping,
        noCreditCardFee: selectedPackage.noCreditCardFee,
        exclusiveProducts: selectedPackage.exclusiveProducts,
        limitedReleases: selectedPackage.limitedReleases
      });
      
      setFormData(prev => ({
        ...prev,
        subscription: selectedSubscription,
        tier: selectedPackage.tier,
        freeShipping: selectedPackage.freeShipping,
        noCreditCardFee: selectedPackage.noCreditCardFee,
        exclusiveProducts: selectedPackage.exclusiveProducts,
        limitedReleases: selectedPackage.limitedReleases
      }));
    }
  };

  const handleSubmit = async (values) => {
    if (!values.subscription || !values.tier) {
      message.error('Please fill all required fields');
      return;
    }

    // Format the data
    const formattedData = {
      ...values,
      billingDate: values.billingDate ? values.billingDate.toISOString() : new Date().toISOString(),
      card: {
        cardHolderName: values.cardHolderName || '',
        cardNumber: values.cardNumber || '',
        expiryDate: values.expiryDate || '',
        cvv: values.cvv || '',
        zipCode: values.zipCode || ''
      }
    };
    
    // Remove card fields from root level
    delete formattedData.cardHolderName;
    delete formattedData.cardNumber;
    delete formattedData.expiryDate;
    delete formattedData.cvv;
    delete formattedData.zipCode;

    try {
      if (editingRecord) {
        // Use retailer ID instead of subscription ID
        await updateSubscribedPackage({
          id: editingRecord.retailerId || values.retailerId,
          data: {
            ...formattedData
          }
        }).unwrap();
        message.success('Subscription updated successfully');
      } else {
        // For new subscription creation
        message.info('New subscription functionality not implemented yet');
      }
      handleCancel();
    } catch (error) {
      message.error('Failed to save subscription');
      console.error('Error:', error);
    }
  };

  const handleBoxSelection = async (values) => {
    const { selectedProducts } = values;
    const minBoxesRequired = getMinimumBoxesRequired(selectedSubscription?.tier);
    
    if (!selectedProducts || selectedProducts.length === 0) {
      message.error('Please select at least one product');
      return;
    }
    
    if (selectedProducts.length < minBoxesRequired) {
      message.error(`You must select at least ${minBoxesRequired} boxes based on your tier`);
      return;
    }

    try {
      // Map selected IDs to full product objects
      const selectedBoxes = selectedProducts.map(id => {
        const product = availableProducts.find(p => p._id === id);
        return {
          productId: product._id,
          name: product.name,
          size: product.size,
          price: product.price
        };
      });

      // Send data in the exact format required by the backend
      // Use retailer ID instead of subscription ID
      await addExtraBoxes({
        id: selectedSubscription.retailerId,
        data: { extraBoxes: selectedBoxes }
      }).unwrap();

      message.success('Extra boxes added successfully');
      handleBoxSelectionCancel();
    } catch (error) {
      message.error('Failed to add extra boxes');
      console.error('Error:', error);
    }
  };

  const handleProductSelection = (checkedValues) => {
    const selectedBoxes = checkedValues.map(id => {
      return availableProducts.find(product => product._id === id);
    }).filter(Boolean);
    
    setBoxSelectionData({
      selectedBoxes
    });
  };

  const timeInfo = getSelectionTimeInfo();

  // Get retailer name by userId
  const getRetailerName = (userId) => {
    const retailer = retailersList.find(r => r._id === userId);
    return retailer?.name || 'Unknown';
  };

  const getRetailerEmail = (userId) => {
    const retailer = retailersList.find(r => r._id === userId);
    return retailer?.email || 'Unknown';
  };

  // Table columns
  const columns = [
    {
      title: 'SL',
      dataIndex: 'index',
      key: 'index',
      render: (_, __, index) => index + 1,
      width: 60
    },
    {
      title: 'Retailer Name',
      dataIndex: 'name',
      key: 'retailerName',
      // render: (userId) => (
      //   <>
      //     <Text strong>{getRetailerName(userId)}</Text>
      //     <br />
      //     <Text type="secondary" style={{ fontSize: '12px' }}>{userId}</Text>
      //   </>
      // )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // render: (userId) => getRetailerEmail(userId)
    },
    {
      title: 'Tier',
      dataIndex: 'activeSubscription',
      key: 'tier',
      render: (activeSubscription) => activeSubscription?.tier ? <Tag color="blue">{activeSubscription.tier}</Tag> : '-'
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'activeSubscription',
    //   key: 'status',
    //   render: (activeSubscription) => {
    //     if (!activeSubscription?.status) return '-';
        
    //     let color = 'green';
    //     if (activeSubscription.status === 'paused') color = 'orange';
    //     if (activeSubscription.status === 'cancelled') color = 'red';
        
    //     return <Tag color={color}>{activeSubscription.status?.toUpperCase()}</Tag>;
    //   }
    // },
    {
      title: 'Extra Boxes',
      dataIndex: 'activeSubscription',
      key: 'extraBox',
      render: (activeSubscription) => (
        <Badge count={activeSubscription?.extraBox?.length || 0} showZero style={{ backgroundColor: '#1890ff' }} />
      )
    },
    // {
    //   title: 'Selection Status',
    //   key: 'selectionStatus',
    //   render: (_, record) => {
    //     const status = getSelectionStatus(record.activeSubscription || {});
    //     return <Tag color={status.color}>{status.text}</Tag>;
    //   }
    // },
    {
      title: 'Billing Date',
      dataIndex: 'activeSubscription',
      key: 'billingDate',
      render: (activeSubscription) => activeSubscription?.billingDate ? moment(activeSubscription.billingDate).format('MM/DD/YYYY') : 'Not set'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const timeInfo = getSelectionTimeInfo();
        const canEdit = isEditAllowed(record.activeSubscription);
        
        return (
          <Space>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => showModal(record.activeSubscription, record)}
              disabled={!record.activeSubscription}
            >
              Edit
            </Button>
            <Button
              type="primary" 
              icon={<ShoppingCartOutlined />}
              size="small"
              disabled={(!timeInfo?.isOpen && !canEdit) || !record.activeSubscription}
              style={{ backgroundColor: (timeInfo.isOpen || canEdit) && record.activeSubscription ? '#52c41a' : undefined }}
              onClick={() => showBoxSelection(record.activeSubscription, record)}
            >
              Extra Boxes
            </Button>
          </Space>
        );
      }
    }
  ];

  if (isRetailersLoading || isSubscriptionsLoading || isProductLoading || isRetailerSubscribedPackageLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <Card style={{ margin: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Retailer Subscription Management</Title>
        </Col>
        <Col>
          <Tag icon={<ClockCircleOutlined />} color={timeInfo.color}>
            {timeInfo.message}
          </Tag>
        </Col>
      </Row>
      
      <Table
        columns={columns}
        dataSource={retailersList}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
      />
      
      {/* Subscription Form Modal */}
      <Modal
        title={editingRecord ? 'Edit Subscription' : 'Add Subscription'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'running',
            billingDate: moment(),
            termsAndConditionsAccepted: true
          }}
        >
          {/* Hidden retailer ID field */}
          <Form.Item name="retailerId" hidden>
            <Input />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="subscription"
                label="Subscription"
                rules={[{ required: true, message: 'Please select a subscription' }]}
              >
                <Select 
                  placeholder="Select Subscription" 
                  onChange={handleSubscriptionChange}
                >
                  {subscriptionPackages.map(pkg => (
                    <Option key={pkg._id} value={pkg.subscription}>
                      {pkg.subscription}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="tier" 
                label="Tier"
                rules={[{ required: true, message: 'Please enter tier' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="noCreditCardFee" label="No Credit Card Fee">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="exclusiveProducts" label="Exclusive Products">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="limitedReleases" label="Limited Releases">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isUpdateLoadingPackage}
              >
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Box Selection Modal */}
      <Modal
        title={`Select Extra Boxes - ${selectedSubscription ? selectedSubscription.userId : ''}`}
        visible={isBoxSelectionVisible}
        onCancel={handleBoxSelectionCancel}
        footer={null}
        width={1000}
      >
        <Alert
          message={
            <div>
              <p><strong>Current Tier:</strong> {selectedSubscription?.tier}</p>
              <p><strong>Minimum Boxes Required:</strong> {getMinimumBoxesRequired(selectedSubscription?.tier)}</p>
              <p><strong>Selection Window:</strong> 1st to 22nd of every month</p>
              <p><strong>Edit Window:</strong> Until 4th of the month after selection</p>
            </div>
          }
          description="Select additional products for this subscription."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={boxSelectionForm}
          onFinish={handleBoxSelection}
          layout="vertical"
        >
          <Form.Item 
            name="selectedProducts" 
            label="Available Products"
            rules={[{ required: true, message: 'Please select at least one product' }]}
          >
            <Checkbox.Group 
              onChange={handleProductSelection} 
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 16]}>
                {availableProducts.map(product => {
                  const isSelected = boxSelectionData.selectedBoxes.some(p => p._id === product._id);
                  
                  return (
                    <Col span={8} key={product._id}>
                      <Card 
                        hoverable 
                        size="small" 
                        style={{ 
                          borderColor: isSelected ? '#1890ff' : undefined,
                          backgroundColor: isSelected ? '#e6f7ff' : undefined
                        }}
                      >
                        <Checkbox value={product._id} style={{ marginRight: 8 }}>
                          <div>
                            <Text strong>{product.name}</Text>
                            <div>
                              <Text type="secondary">Size: {product.size}</Text>
                            </div>
                            <div>
                              <Text type="secondary">Qty: {product.quantity}</Text>
                            </div>
                            <div>
                              <Text type="success" strong>${product.price}</Text>
                            </div>
                            {/* {product.image && product.image.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <Image 
                                  src={product.image[0]} 
                                  alt={product.name} 
                                  width={64}
                                  height={64}
                                  style={{ objectFit: 'cover' }}
                                  fallback="https://via.placeholder.com/100?text=No+Image"
                                />
                              </div>
                            )} */}
                          </div>
                        </Checkbox>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
          
          {boxSelectionData.selectedBoxes.length > 0 && (
            <>
              <Divider>Selected Products</Divider>
              <Table
                dataSource={boxSelectionData.selectedBoxes}
                rowKey="_id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: 'Product',
                    dataIndex: 'name',
                    key: 'name'
                  },
                  {
                    title: 'Size',
                    dataIndex: 'size',
                    key: 'size'
                  },
                  {
                    title: 'Price',
                    dataIndex: 'price',
                    key: 'price',
                    render: (price) => `$${price}`
                  },
                  // {
                  //   title: 'Action',
                  //   key: 'action',
                  //   render: (_, record) => (
                  //     <Button 
                  //       type="text" 
                  //       danger
                  //       icon={<DeleteOutlined />}
                  //       onClick={() => {
                  //         const newSelectedBoxes = boxSelectionData.selectedBoxes.filter(p => p._id !== record._id);
                  //         setBoxSelectionData({ selectedBoxes: newSelectedBoxes });
                  //         boxSelectionForm.setFieldsValue({
                  //           selectedProducts: newSelectedBoxes.map(p => p._id)
                  //         });
                  //       }}
                  //     />
                  //   )
                  // }
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>
                        ${boxSelectionData.selectedBoxes.reduce((sum, product) => sum + Number(product.price), 0).toFixed(2)}
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} />
                  </Table.Summary.Row>
                )}
              />
            </>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <Text>Selected: {boxSelectionData.selectedBoxes.length} items</Text>
            <Space>
              <Button onClick={handleBoxSelectionCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isAddExtraBoxesLoading}
                disabled={boxSelectionData.selectedBoxes.length < getMinimumBoxesRequired(selectedSubscription?.tier)}
              >
                Save Selection
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </Card>
  );
};

export default RetailerSubscriptionManager;