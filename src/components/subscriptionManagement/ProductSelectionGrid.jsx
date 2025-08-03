import React from 'react';
import { Row, Col, Card, Checkbox, Typography } from 'antd';

const { Text } = Typography;

const ProductSelectionGrid = ({ products, selectedBoxes }) => {
  return (
    <Row gutter={[16, 16]}>
      {products.map(product => {
        const isSelected = selectedBoxes.some(p => p._id === product._id);
        const selectedProduct = selectedBoxes.find(p => p._id === product._id);
        
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
                  {isSelected && selectedProduct?.selectedQuantity && (
                    <div>
                      <Text type="primary" strong>Selected Qty: {selectedProduct.selectedQuantity}</Text>
                    </div>
                  )}
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
  );
};

export default ProductSelectionGrid;