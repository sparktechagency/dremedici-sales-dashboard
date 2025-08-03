import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, message } from 'antd';
import moment from 'moment';
import { useUpdateSubscribedPackageMutation } from '../../redux/apiSlices/retailerManagementApi';

const { Option } = Select;

const SubscriptionFormModal = ({
  visible,
  onCancel,
  onSuccess,
  editingRecord,
  subscriptionPackages
}) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [updateSubscribedPackage, { isLoading: isUpdateLoadingPackage }] = useUpdateSubscribedPackageMutation();

  // Initialize form when modal opens
  useEffect(() => {
    if (visible && editingRecord) {
      const selectedPackage = subscriptionPackages.find(pkg => pkg.tier === editingRecord.tier);
      
      const initialValues = {
        userId: editingRecord.userId,
        retailerId: editingRecord.retailerId,
        subscription: editingRecord.subscription,
        tier: editingRecord.tier,
        freeShipping: selectedPackage?.freeShipping || editingRecord.freeShipping,
        noCreditCardFee: selectedPackage?.noCreditCardFee || editingRecord.noCreditCardFee,
        exclusiveProducts: selectedPackage?.exclusiveProducts || editingRecord.exclusiveProducts,
        limitedReleases: selectedPackage?.limitedReleases || editingRecord.limitedReleases,
        termsAndConditionsAccepted: editingRecord.termsAndConditionsAccepted || true,
        status: editingRecord.status || 'running',
        billingDate: editingRecord.billingDate ? moment(editingRecord.billingDate) : moment(),
        cardHolderName: editingRecord.card?.cardHolderName || '',
        cardNumber: editingRecord.card?.cardNumber || '',
        expiryDate: editingRecord.card?.expiryDate || '',
        cvv: editingRecord.card?.cvv || '',
        zipCode: editingRecord.card?.zipCode || ''
      };
      
      form.setFieldsValue(initialValues);
      setFormData({
        ...editingRecord,
        card: editingRecord.card || {
          cardHolderName: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          zipCode: ''
        }
      });
    }
  }, [visible, editingRecord, subscriptionPackages, form]);

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
        await updateSubscribedPackage({
          id: editingRecord.retailerId || values.retailerId,
          data: formattedData
        }).unwrap();
        message.success('Subscription updated successfully');
      } else {
        message.info('New subscription functionality not implemented yet');
      }
      
      if (onSuccess) {
        onSuccess();
      } else {
        handleCancel();
      }
    } catch (error) {
      message.error('Failed to save subscription');
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFormData({});
    onCancel();
  };

  return (
    <Modal
      title={editingRecord ? 'Edit Subscription' : 'Add Subscription'}
      visible={visible}
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
  );
};

export default SubscriptionFormModal;