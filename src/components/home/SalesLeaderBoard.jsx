import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const dataSource = [
  {
    sl: 1,
    retailerName: "Alice Johnson",
    email: "alice@example.com",
    totalSales: "$5000",
    tier: "Gold",
    status: "Active",
  },
  {
    sl: 2,
    retailerName: "John Doe",
    email: "john@example.com",
    totalSales: "$3200",
    tier: "Silver",
    status: "Inactive",
  },
  {
    sl: 3,
    retailerName: "Emma Watson",
    email: "emma@example.com",
    totalSales: "$4100",
    tier: "Gold",
    status: "Active",
  },
  {
    sl: 4,
    retailerName: "Robert Brown",
    email: "robert@example.com",
    totalSales: "$1800",
    tier: "Bronze",
    status: "Pending",
  },
  {
    sl: 5,
    retailerName: "Sophia Lee",
    email: "sophia@example.com",
    totalSales: "$2250",
    tier: "Silver",
    status: "Active",
  },
  {
    sl: 6,
    retailerName: "Michael Clark",
    email: "michael@example.com",
    totalSales: "$2750",
    tier: "Bronze",
    status: "Inactive",
  },
  {
    sl: 7,
    retailerName: "David Miller",
    email: "david@example.com",
    totalSales: "$3900",
    tier: "Gold",
    status: "Active",
  },
  {
    sl: 8,
    retailerName: "Olivia Wilson",
    email: "olivia@example.com",
    totalSales: "$4600",
    tier: "Platinum",
    status: "Active",
  },
  {
    sl: 9,
    retailerName: "William Taylor",
    email: "william@example.com",
    totalSales: "$1500",
    tier: "Bronze",
    status: "Pending",
  },
  {
    sl: 10,
    retailerName: "Liam Johnson",
    email: "liam@example.com",
    totalSales: "$5100",
    tier: "Platinum",
    status: "Active",
  },
];

const columns = [
  { title: "SL", dataIndex: "sl", key: "sl", align: "center" },
  {
    title: "Retailer Name",
    dataIndex: "retailerName",
    key: "retailerName",
    align: "center",
  },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  {
    title: "Total Sales",
    dataIndex: "totalSales",
    key: "totalSales",
    align: "center",
  },
  { title: "Tier", dataIndex: "tier", key: "tier", align: "center" },
  { title: "Status", dataIndex: "status", key: "status", align: "center" },
];

const SalesLeaderBoard = () => {
  const [searchText, setSearchText] = useState("");

  // Search handler
  const handleSearch = (value) => setSearchText(value);

  // Filtering the data based on the search text
  const filteredData = dataSource.filter(
    (item) =>
      item.retailerName.toLowerCase().includes(searchText.toLowerCase()) 
  );

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold text-gray-800">Sales Leaderboard</h1>
        <Input
          placeholder="Search Order, Retailer, Sales"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className="w-1/3 py-2"
        />
      </div>
      {/* Table Container with Gradient Background */}
      <div className="px-6 pt-6 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 7 }}
          bordered={false}
          size="small"
          rowClassName="custom-table"
        />
      </div>
    </div>
  );
};

export default SalesLeaderBoard;
