import { useState } from "react";
import { Table, Tag, Input, Select } from "antd";

const { Option } = Select;

const CommissionTrackingContainer = () => {
  // Sample Data
  const initialData = [
    {
      key: "1",
      sl: 1,
      productName: "Product A",
      salesAmount: 800,
      commissionEarned: 60,
      commissionRate: 10,
      saleDate: "Jan 10, 2025",
      productStatus: "Active",
    },
    {
      key: "2",
      sl: 2,
      productName: "Product B",
      salesAmount: 1000,
      commissionEarned: 80,
      commissionRate: 12,
      saleDate: "Feb 15, 2024",
      productStatus: "Inactive",
    },
    {
      key: "3",
      sl: 3,
      productName: "Product C",
      salesAmount: 500,
      commissionEarned: 40,
      commissionRate: 8,
      saleDate: "Mar 20, 2025",
      productStatus: "Active",
    },
  ];

  const [searchText, setSearchText] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Columns
  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      align: "center",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Sales Amount",
      dataIndex: "salesAmount",
      key: "salesAmount",
      render: (text) => `$${text}`,
      align: "center",
    },
    {
      title: "Commission Earned",
      dataIndex: "commissionEarned",
      key: "commissionEarned",
      render: (text) => `$${text}`,
      align: "center",
    },
    {
      title: "Commission Rate",
      dataIndex: "commissionRate",
      key: "commissionRate",
      render: (text) => `${text}%`,
      align: "center",
    },
    {
      title: "Sale Date",
      dataIndex: "saleDate",
      key: "saleDate",
      align: "center",
    },
    {
      title: "Product Status",
      dataIndex: "productStatus",
      key: "productStatus",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
      align: "center",
    },
  ];

  // 🔹 Apply Filters
  const filteredData = initialData.filter((item) => {
    const lowerCaseName = item.productName.toLowerCase();
    const saleYear = item.saleDate.split(" ")[2]; // Extracting Year
    const saleMonth = item.saleDate.split(" ")[0]; // Extracting Month

    return (
      lowerCaseName.includes(searchText.toLowerCase()) &&
      (!selectedYear || saleYear === selectedYear) &&
      (!selectedMonth || saleMonth === selectedMonth)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6">Commission Breakdown</h2>

        {/* 🔹 Search & Filter Inputs */}
        <div className="flex gap-4 mb-4">
          {/* 🔍 Search Input */}
          <Input
            placeholder="Search by Product Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-60 py-2"
          />

          {/*  Filter by Year */}
          <Select
            placeholder="Filter by year"
            allowClear
            onChange={setSelectedYear}
            className="w-40 "
            style={{ height: "40px" }}
          >
            <Option value="2025">2025</Option>
            <Option value="2024">2024</Option>
          </Select>

          {/* Filter by Month */}
          <Select
            placeholder="Filter by month"
            allowClear
            onChange={setSelectedMonth}
            className="w-40"
            style={{ height: "40px" }}
          >
            <Option value="Jan">January</Option>
            <Option value="Feb">February</Option>
            <Option value="Mar">March</Option>
          </Select>
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="bg-gradient-to-r from-primary to-secondary pt-6 px-6 rounded-xl">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 5 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
        />
      </div>
    </div>
  );
};

export default CommissionTrackingContainer;
