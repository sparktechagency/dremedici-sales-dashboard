import React from 'react';
import { Table, Typography, Button, InputNumber } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const { Text } = Typography;

const SelectedProductsTable = ({ 
  selectedBoxes, 
  onQuantityChange, 
  getTotalSelectedBoxes, 
  getTotalPrice 
}) => {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name'
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
      render: (price) => `$${price}`
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
            onClick={() => onQuantityChange(record._id, (record.selectedQuantity || 1) - 1)}
            disabled={record.selectedQuantity <= 1}
          />
          <InputNumber
            min={1}
            value={record.selectedQuantity || 1}
            onChange={(value) => onQuantityChange(record._id, value || 1)}
            style={{ width: '60px' }}
            size="small"
          />
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => onQuantityChange(record._id, (record.selectedQuantity || 1) + 1)}
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

  return (
    <Table
      dataSource={selectedBoxes}
      rowKey="_id"
      pagination={false}
      size="small"
      columns={columns}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={3}>
            <Text strong>Total</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Text strong>Total {getTotalSelectedBoxes()} boxes</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <Text strong>
              ${getTotalPrice().toFixed(2)}
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );
};

export default SelectedProductsTable;