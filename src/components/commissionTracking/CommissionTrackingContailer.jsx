import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import { useGetCommissionsQuery } from "../../redux/apiSlices/commissionApi";

const CommissionTrackingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchText, setSearchText] = useState("");

  // Build query params array dynamically
  const queryParams = [
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
  ];

  if (searchText.trim() !== "") {
    queryParams.push({ name: "searchTerm", value: searchText.trim() });
  }

  const { data, isLoading } = useGetCommissionsQuery(queryParams);

  const commissionData = data?.data || [];
  const paginationInfo = data?.pagination || {};

  const dataSource = commissionData.map((item, index) => ({
    key: item._id,
    sl: (currentPage - 1) * pageSize + index + 1,
    productName: item.products?.[0]?.productId?.name || "N/A",
    quantitySold: item.products?.reduce((sum, p) => sum + p.quantity, 0),
    salesAmount: item.totalAmount,
    commissionEarned: item.totalCommission,
    lastSaleDate: new Date(item.createdAt).toLocaleDateString(),
    productStatus: item.orderStatus,
  }));

  const columns = [
    { title: "SL", dataIndex: "sl", key: "sl", align: "center" },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      align: "center",
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      key: "quantitySold",
      align: "center",
    },
    {
      title: "Sales Amount",
      dataIndex: "salesAmount",
      key: "salesAmount",
      render: (text) => `$${text.toFixed(2)}`,
      align: "center",
    },
    {
      title: "Commission Earned",
      dataIndex: "commissionEarned",
      key: "commissionEarned",
      render: (text) => `$${text.toFixed(2)}`,
      align: "center",
    },
    {
      title: "Last Sale Date",
      dataIndex: "lastSaleDate",
      key: "lastSaleDate",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "productStatus",
      key: "productStatus",
      align: "center",
    },
  ];

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold mb-4">Commission Breakdown</h2>

        {/* Search Input */}
        <Input
          placeholder="Search by product name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="mb-4 w-64 py-2"
          allowClear
        />
      </div>

      <div className="bg-gradient-to-r from-primary to-secondary pt-6 px-6 rounded-xl">
        <Table
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: paginationInfo.page || currentPage,
            pageSize: paginationInfo.limit || pageSize,
            total: paginationInfo.total || 0,
            onChange: (page) => setCurrentPage(page),
          }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
        />
      </div>
    </div>
  );
};

export default CommissionTrackingContainer;
