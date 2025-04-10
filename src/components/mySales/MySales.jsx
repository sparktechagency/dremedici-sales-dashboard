import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Select, Spin } from "antd";

const { Option } = Select;

const MySales = () => {
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState([]);
  const [yearComparison, setYearComparison] = useState(["2024", "2023"]);

  // Simulate fetching data
  useEffect(() => {
    // This would be replaced with an actual API call in production
    const fetchSalesData = () => {
      setLoading(true);

      // Mock data for demonstration
      setTimeout(() => {
        const mockData = [
          { month: "Jan", 2023: 4000, 2024: 4400 },
          { month: "Feb", 2023: 3000, 2024: 3800 },
          { month: "Mar", 2023: 5000, 2024: 5200 },
          { month: "Apr", 2023: 2780, 2024: 3908 },
          { month: "May", 2023: 1890, 2024: 2800 },
          { month: "Jun", 2023: 2390, 2024: 3300 },
          { month: "Jul", 2023: 3490, 2024: 3900 },
          { month: "Aug", 2023: 4000, 2024: 4100 },
          { month: "Sep", 2023: 2500, 2024: 3000 },
          { month: "Oct", 2023: 3100, 2024: 3700 },
          { month: "Nov", 2023: 5200, 2024: 5500 },
          { month: "Dec", 2023: 6000, 2024: 6200 },
        ];

        setSalesData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchSalesData();
  }, []);

  // Available years for comparison
  const availableYears = ["2022", "2023", "2024", "2025"];

  const handleYearChange = (value) => {
    setYearComparison(value);
  };

  // Calculate total sales for selected years
  const calculateTotals = () => {
    const totals = {};

    yearComparison.forEach((year) => {
      totals[year] = salesData.reduce(
        (sum, item) => sum + (item[year] || 0),
        0
      );
    });

    return totals;
  };

  const salesTotals = calculateTotals();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">My Sales</h2>

      <div className="mb-6 bg-gradient-to-r from-primary to-secondary p-6">
        <Card title="Year-over-Year Comparison" className="w-full shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Select Years to Compare:
            </label>
            <Select
              mode="multiple"
              placeholder="Select years"
              value={yearComparison}
              onChange={handleYearChange}
              style={{ width: "100%", height: 40 }}
              maxTagCount={4}
            >
              {availableYears.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <>
              {/* Total Sales Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                {yearComparison.map((year) => (
                  <div
                    key={year}
                    className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded"
                  >
                    <h3 className="text-lg font-medium">{year} Total</h3>
                    <p className="text-2xl font-bold">
                      ${salesTotals[year]?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sales Chart */}
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                    {yearComparison.map((year, index) => (
                      <Line
                        key={year}
                        type="monotone"
                        dataKey={year}
                        stroke={
                          index === 0
                            ? "#8884d8"
                            : index === 1
                            ? "#82ca9d"
                            : "#ffc658"
                        }
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MySales;
