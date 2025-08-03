import React, { useState, useEffect } from 'react';
import { 
  useGeAllSubscriptionQuery, 
  useGetAllRetailersQuery, 
  useRetailerSubscribedPackageQuery
} from '../../redux/apiSlices/retailerManagementApi';
import { useGetProductsQuery } from '../../redux/apiSlices/homeSlice';
import { 
  Table, Button, Space, Card, Tag, Badge, Spin, 
  Typography, Row, Col, message
} from 'antd';
import { 
  EditOutlined, ShoppingCartOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ExtraBoxesModal from './ExtraBoxesModal';
import SubscriptionFormModal from './SubscriptionFormModal';

const { Title } = Typography;

const RetailerSubscriptionManager = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBoxSelectionVisible, setIsBoxSelectionVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // API calls
  const { data: retailers, isLoading: isRetailersLoading, refetch: refetchRetailers } = useGetAllRetailersQuery();
  const { data: allSubscriptions, isLoading: isSubscriptionsLoading } = useGeAllSubscriptionQuery();
  const { data: products, isLoading: isProductLoading } = useGetProductsQuery();
  const { data: retailerSubscribedPackage, isLoading: isRetailerSubscribedPackageLoading } = useRetailerSubscribedPackageQuery();

  // Data from APIs
  const availableProducts = products?.data || [];
  const retailersList = retailers?.data || [];
  const subscriptionPackages = allSubscriptions?.data || [];
  const subscribedPackages = retailerSubscribedPackage?.data || [];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Check if selection window is open (1st to 3rd of every month)
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
      const closeDate = new Date(currentYear, currentMonth, 4);
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

  const showModal = (record = null, retailer = null) => {
    if (!record) {
      setIsModalVisible(false);
      return;
    }
    
    setEditingRecord({
      ...record,
      retailerId: retailer?._id,
      retailerName: retailer?.name,
      retailerEmail: retailer?.email
    });
    
    setIsModalVisible(true);
  };

  const showBoxSelection = (subscription, retailer) => {
    if (!subscription) {
      message.warning('No active subscription found for this retailer');
      return;
    }
    
    setSelectedSubscription({
      ...subscription,
      retailerId: retailer?._id,
      retailerName: retailer?.name,
      retailerEmail: retailer?.email,
      userId: retailer?._id // for compatibility
    });
    
    setIsBoxSelectionVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const handleBoxSelectionCancel = () => {
    setIsBoxSelectionVisible(false);
    setSelectedSubscription(null);
  };

  // Refresh data after successful operations
  const handleSuccessfulUpdate = () => {
    refetchRetailers();
    handleModalCancel();
  };

  const handleSuccessfulBoxUpdate = () => {
    refetchRetailers();
    handleBoxSelectionCancel();
  };

  const timeInfo = getSelectionTimeInfo();

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
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tier',
      dataIndex: 'activeSubscription',
      key: 'tier',
      render: (activeSubscription) => {
        if (!activeSubscription?.tier) return '-';
        return <Tag color="blue">{activeSubscription.tier}</Tag>;
      }
    },
    // {
    //   title: 'Subscription',
    //   dataIndex: 'activeSubscription',
    //   key: 'subscription',
    //   render: (activeSubscription) => {
    //     if (!activeSubscription?.subscription) return '-';
    //     return <Tag color="green">{activeSubscription.subscription}</Tag>;
    //   }
    // },
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
    // {
    //   title: 'Extra Boxes',
    //   dataIndex: 'activeSubscription',
    //   key: 'extraBox',
    //   render: (activeSubscription) => {
    //     const count = activeSubscription?.extraBox?.length || 0;
    //     return (
    //       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    //         <Badge count={count} showZero style={{ backgroundColor: '#1890ff' }} />
    //         {count > 0 && (
    //           <span style={{ fontSize: '12px', color: '#666' }}>
    //             ({activeSubscription.extraBox.reduce((total, box) => total + (box.quantity || 1), 0)} total)
    //           </span>
    //         )}
    //       </div>
    //     );
    //   }
    // },
    {
      title: 'Selection Status',
      key: 'selectionStatus',
      render: (_, record) => {
        const timeInfo = getSelectionTimeInfo();
        
        if (!record.activeSubscription) {
          return <Tag color="default">No Subscription</Tag>;
        }
        
        if (!timeInfo?.isOpen) {
          return <Tag color="default">Selection Window Closed</Tag>;
        }
        
        if (record.activeSubscription?.extraBox?.length > 0) {
          return <Tag color="success">Selection Complete</Tag>;
        }
        
        return <Tag color="warning">Selection Pending</Tag>;
      }
    },
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
              Select Boxes
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
      <SubscriptionFormModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleSuccessfulUpdate}
        editingRecord={editingRecord}
        subscriptionPackages={subscriptionPackages}
      />
      
      {/* Extra Boxes Modal */}
      <ExtraBoxesModal
        visible={isBoxSelectionVisible}
        onCancel={handleBoxSelectionCancel}
        onSuccess={handleSuccessfulBoxUpdate}
        selectedSubscription={selectedSubscription}
        availableProducts={availableProducts}
      />
    </Card>
  );
};

export default RetailerSubscriptionManager;