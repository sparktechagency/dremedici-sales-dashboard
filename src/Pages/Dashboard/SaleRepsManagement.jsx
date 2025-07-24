import React, { useState } from "react";
import SalesRepsManagement from "../../components/SalesRepsManagement/SalesRepsManagement";
import { Tabs } from "antd";
import RetailerSubscriptionManager from "../../components/subscriptionManagement/RetailerSubscriptionManager";

const { TabPane } = Tabs;

const SaleRepsManagementPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Sales Representatives" key="1">
          <SalesRepsManagement />
        </TabPane>
        <TabPane tab="Subscription Management" key="2">
          <RetailerSubscriptionManager />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SaleRepsManagementPage;
