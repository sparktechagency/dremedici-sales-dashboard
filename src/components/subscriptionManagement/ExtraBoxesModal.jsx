import React, { useState, useEffect } from 'react';
import { 
  Modal, Form, Alert, Checkbox, Row, Col, Card, Typography, 
  Button, Space, Divider, message, Table, InputNumber
} from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useAddExtraBoxesMutation } from '../../redux/apiSlices/retailerManagementApi';

const { Text, Title } = Typography;

const ExtraBoxesModal = ({ 
  visible, 
  onCancel, 
  onSuccess,
  selectedSubscription, 
  availableProducts 
}) => {
  const [form] = Form.useForm();
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [addExtraBoxes, { isLoading: isAddExtraBoxesLoading }] = useAddExtraBoxesMutation();

  // Function to extract minimum boxes required from tier string
  const getMinimumBoxesRequired = (tierString) => {
    if (!tierString) return 0;
    
    const boxMatch = tierString.match(/(\d+)\s*box(?:es)?/i);
    if (boxMatch && boxMatch[1]) {
      return parseInt(boxMatch[1], 10);
    }
    
    return 0;
  };

  // Reset form and selected boxes when modal opens/closes
  useEffect(() => {
    if (visible && selectedSubscription) {
      // If subscription has extraBox, pre-select those products with their quantities
      if (selectedSubscription?.extraBox && selectedSubscription.extraBox.length > 0) {
        const preSelectedProducts = selectedSubscription.extraBox.map(box => {
          const product = availableProducts.find(p => p._id === box.productId);
          return product ? {
            ...product,
            selectedQuantity: box.quantity || 1
          } : null;
        }).filter(Boolean);
        
        setSelectedBoxes(preSelectedProducts);
      } else {
        setSelectedBoxes([]);
      }
    } else {
      setSelectedBoxes([]);
    }
  }, [visible, selectedSubscription, availableProducts]);

  const handleProductSelection = (checkedValues) => {
    const newSelectedBoxes = checkedValues.map(id => {
      const product = availableProducts.find(product => product._id === id);
      const existingProduct = selectedBoxes.find(p => p._id === id);
      
      return product ? {
        ...product,
        selectedQuantity: existingProduct?.selectedQuantity || 1
      } : null;
    }).filter(Boolean);
    
    setSelectedBoxes(newSelectedBoxes);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    
    setSelectedBoxes(prevSelected => 
      prevSelected.map(product => 
        product._id === productId 
          ? { ...product, selectedQuantity: newQuantity }
          : product
      )
    );
  };

  const getTotalSelectedBoxes = () => {
    return selectedBoxes.reduce((total, product) => total + (product.selectedQuantity || 1), 0);
  };

  const getTotalPrice = () => {
    return selectedBoxes.reduce((total, product) => {
      return total + (Number(product.price) * (product.selectedQuantity || 1));
    }, 0);
  };

  const handleSubmit = async () => {
    const minBoxesRequired = getMinimumBoxesRequired(selectedSubscription?.tier);
    
    if (!selectedBoxes || selectedBoxes.length === 0) {
      message.error('Please select at least one product');
      return;
    }
    
    const totalBoxes = getTotalSelectedBoxes();
    if (totalBoxes < minBoxesRequired) {
      message.error(`You must select at least ${minBoxesRequired} boxes based on your tier. Currently selected: ${totalBoxes}`);
      return;
    }

    try {
      const selectedBoxesData = selectedBoxes.map(product => ({
        productId: product._id,
        name: product.name,
        size: product.size || '',
        price: product.price,
        quantity: product.selectedQuantity || 1
      }));

      await addExtraBoxes({
        id: selectedSubscription.retailerId,
        data: { extraBoxes: selectedBoxesData }
      }).unwrap();

      message.success('Extra boxes added successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        onCancel();
      }
    } catch (error) {
      message.error('Failed to add extra boxes');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setSelectedBoxes([]);
    form.resetFields();
    onCancel();
  };

  // Table columns for selected products
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: size => size || 'N/A'
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      key: 'price',
      render: price => `$${price}`
    },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record._id, (record.selectedQuantity || 1) - 1)}
            disabled={record.selectedQuantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.selectedQuantity || 1}
            onChange={(value) => handleQuantityChange(record._id, value || 1)}
            style={{ width: '60px' }}
            size="small"
          />
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record._id, (record.selectedQuantity || 1) + 1)}
          />
        </div>
      )
    },
    {
      title: 'Total Price',
      key: 'totalPrice',
      render: (_, record) => (
        <Text strong>
          ${(Number(record.price) * (record.selectedQuantity || 1)).toFixed(2)}
        </Text>
      )
    }
  ];

  if (!selectedSubscription) return null;

  const minimumBoxesRequired = getMinimumBoxesRequired(selectedSubscription?.tier);

  return (
    <Modal
      title={`Select Extra Boxes - ${selectedSubscription.retailerName || selectedSubscription.userId || ''}`}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1200}
    >
      <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#e6f7ff', borderRadius: '6px' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Text strong>Current Tier:</Text> {selectedSubscription.tier}
          </Col>
          <Col span={8}>
            <Text strong>Subscription:</Text> {selectedSubscription.subscription}
          </Col>
        </Row>
        {minimumBoxesRequired > 0 && (
          <div style={{ marginTop: 8 }}>
            <Text type="primary" strong>
              Minimum Boxes Required: {minimumBoxesRequired}
            </Text>
            {getTotalSelectedBoxes() < minimumBoxesRequired && (
              <Text type="danger" style={{ marginLeft: 16 }}>
                (Need {minimumBoxesRequired - getTotalSelectedBoxes()} more boxes)
              </Text>
            )}
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <Text>
            Select products for your subscription and adjust quantities as needed.
          </Text>
        </div>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <Title level={5}>Available Products</Title>
        <Checkbox.Group 
          value={selectedBoxes.map(p => p._id)}
          onChange={handleProductSelection} 
          style={{ width: '100%' }}
        >
          <Row gutter={[16, 16]}>
            {availableProducts?.map(product => {
              const isSelected = selectedBoxes.some(p => p._id === product._id);
              
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
                          <Text type="secondary">Size: {product.size || 'N/A'}</Text>
                        </div>
                        <div>
                          <Text type="secondary">Available Qty: {product.quantity || 'N/A'}</Text>
                        </div>
                        <div>
                          <Text type="success" strong>${product.price}</Text>
                        </div>
                      </div>
                    </Checkbox>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Checkbox.Group>
      </div>
      
      {selectedBoxes.length > 0 && (
        <>
          <Divider>Selected Products</Divider>
          <Table
            dataSource={selectedBoxes}
            columns={columns}
            rowKey="_id"
            pagination={false}
            size="small"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>Total</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong>Total {getTotalSelectedBoxes()} boxes</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                  <Text strong>${getTotalPrice().toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <div>
          <Text>Selected: {selectedBoxes.length} products</Text>
          <Text style={{ marginLeft: 16 }}>Total Boxes: {getTotalSelectedBoxes()}</Text>
          <Text style={{ marginLeft: 16 }}>Total Amount: ${getTotalPrice().toFixed(2)}</Text>
        </div>
        <Space>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            onClick={handleSubmit}
            loading={isAddExtraBoxesLoading}
            disabled={getTotalSelectedBoxes() < minimumBoxesRequired}
          >
            Save Selection
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default ExtraBoxesModal;